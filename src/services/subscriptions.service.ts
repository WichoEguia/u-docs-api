import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from 'typeorm';

import { PaymentMethods, PaypalBillingPlan } from 'src/constants';

import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from 'src/entities';

import { PaypalService } from './paypal.service';
import { TrainingsService } from './trainings.service';
import { UsersService } from './users.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private paypalService: PaypalService,
    private trainingsService: TrainingsService,
    private usersService: UsersService
  ) { }

  public async getAll() {
    return await this.subscriptionRepository.find();
  }

  public async findById(idSubscription: number): Promise<Subscription> {
    const subscription = this.subscriptionRepository.findOne(idSubscription);
    if (!subscription) {
      throw new HttpException(
        'No se encontró la suscripción',
        HttpStatus.NOT_FOUND
      );
    }

    return subscription;
  }

  public async create(method: PaymentMethods, idTraining: number, idUser: number) {
    try {
      this.paypalService.setToken(
        await this.paypalService
          .getPaypalToken()
      );

      const plan = await this.createBillingPlan();
      const subscription = await this.createSubscriptionRecord(
        plan,
        method,
        idTraining,
        idUser
      );

      return subscription;
    } catch (error) {
      throw new HttpException(
        `Ha ocurrido un error al procesar la solicitud`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async createBillingPlan(): Promise<PaypalBillingPlan> {
    const plan: PaypalBillingPlan = await this.paypalService.createBillingPlan();
    if (!plan.hasOwnProperty('id')) {
      throw new HttpException(
        'Ha ocurrido un error al crear el plan',
        HttpStatus.BAD_REQUEST
      );
    }

    return plan;
  }

  private async createSubscriptionRecord(
    plan: PaypalBillingPlan,
    method: PaymentMethods,
    idTraining: number,
    idUser: number
  ): Promise<Subscription> {
    try {
      let subscription = await this.subscriptionRepository.create({
        is_active: false,
        start_at: new Date().toISOString(),
        method: method,
        metadata: JSON.stringify(plan),
        training: await this.trainingsService.findById(idTraining),
        user: await this.usersService.findById(idUser)
      });
      
      return await this.subscriptionRepository.save(subscription);
    } catch (error) {
      throw new HttpException(
        'No se logró crear la suscripción',
        HttpStatus.BAD_REQUEST
      ); 
    }
  }

  private async activateBillingPlan(idSubscription: number, metadata: any): Promise<boolean> {
    const subscription = await this.findById(idSubscription);
    if (subscription.is_active) {
      throw new HttpException(
        'La subscripción ya fue activada',
        HttpStatus.BAD_REQUEST
      );
    }

    const plan: PaypalBillingPlan = JSON.parse(subscription.metadata);

    const isPlanActive = await this.paypalService.activateBillingPlan(plan.id);
    if (!isPlanActive) {
      throw new HttpException(
        'No se ha podido activar el plan',
        HttpStatus.BAD_REQUEST
      );
    }

    await this.subscriptionRepository.update(subscription.idSubscription, {
      is_active: true,
      metadata
    });
    
    return subscription.is_active;
  }

  public async createAgreement(idSubscription: number): Promise<Subscription> {
    try {
      this.paypalService.setToken(
        await this.paypalService
          .getPaypalToken()
      );

      const { metadata } = await this.findById(idSubscription);
      const idPlan = JSON.parse(metadata).id;
      
      if (!idPlan) {
        throw new HttpException(
          'No existe el plan en la subscripción',
          HttpStatus.BAD_REQUEST
        );
      }
    
      const agreement = await this.paypalService.createBillingAgreement(idPlan);
      const isPlanActive = await this.activateBillingPlan(idSubscription, JSON.stringify(agreement));
  
      if (!isPlanActive) {
        throw new HttpException(
          'No se ha podido activar el plan',
          HttpStatus.BAD_REQUEST
        );
      }
  
      return await this.findById(idSubscription);
    } catch (error) {
      throw new HttpException(
        'No se ha podido crear el agreement',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}