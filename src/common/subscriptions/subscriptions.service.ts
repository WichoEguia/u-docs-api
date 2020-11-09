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

  async create(idTraining: number, idUser: number) {
    try {
      this.paypalService.setToken(
        await this.paypalService
          .getPaypalToken()
      );

      const plan = await this.paypalService.createBillingPlan();
      if (!plan.hasOwnProperty('id')) {
        throw new HttpException(
          'Ha ocurrido un error al crear el plan',
          HttpStatus.BAD_REQUEST
        );
      }

      const subscription = await this.subscriptionRepository.create({
        training: await this.trainingsService.findById(idTraining),
        user: await this.usersService.findById(idUser)
      });

      if (await this.paypalService.activateBillingPlan(plan.id)) {
        subscription.is_active = true;
        subscription.start_at = new Date().toISOString();
        subscription.method = PaymentMethods.PAYPAL,
        subscription.metadata = JSON.stringify(plan)
      }
      
      return subscription;
    } catch (error) {
      throw new HttpException(
        `Ha ocurrido un error al procesar la solicitud`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}