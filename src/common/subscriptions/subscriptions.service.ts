import { PaypalBillingPlan } from 'src/constants';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from 'typeorm';

import { PaymentMethods } from 'src/constants';

import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from 'src/entities';

import { PaypalService } from './paypal.service';
import { TrainingsService } from '../trainings/trainings.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private paypalService: PaypalService,
    private trainingsService: TrainingsService,
    private usersService: UsersService
  ) { }

  public async findById(idSubscription: number): Promise<Subscription> {
    return this.subscriptionRepository.findOne(idSubscription);
  }

  public async create(method: PaymentMethods, idTraining: number, idUser: number) {
    try {
      this.paypalService.setToken(
        await this.paypalService
          .getPaypalToken()
      );

      const plan = await this.createBillingPlan();
      const subscription = await this.createSubscription(
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

  private async createSubscription(
    plan: PaypalBillingPlan,
    method: PaymentMethods,
    idTraining: number,
    idUser: number
  ): Promise<Subscription> {
    let subscription = await this.subscriptionRepository.create({
      is_active: false,
      start_at: new Date().toISOString(),
      method: method,
      metadata: JSON.stringify(plan),
      training: await this.trainingsService.findById(idTraining),
      user: await this.usersService.findById(idUser)
    });
    
    return await this.subscriptionRepository.save(subscription);
  }

  public async activateSubscription(idSubscription: number): Promise<boolean> {
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
      metadata: JSON.stringify(
        await this.paypalService.getBillingPlan(plan.id)
      )
    });
    
    return subscription.is_active;
  }
}