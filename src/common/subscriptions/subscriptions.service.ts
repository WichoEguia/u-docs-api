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

  async create(method: PaymentMethods, idTraining: number, idUser: number) {
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
    const subscription = await this.subscriptionRepository.create({
      training: await this.trainingsService.findById(idTraining),
      user: await this.usersService.findById(idUser)
    });

    if (await this.paypalService.activateBillingPlan(plan.id)) {
      subscription.is_active = true;
      subscription.start_at = new Date().toISOString(),
      subscription.method = method,
      subscription.metadata = JSON.stringify(plan)
    }

    return await this.subscriptionRepository.save(subscription);
  }
}