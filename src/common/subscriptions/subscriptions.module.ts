import { HttpModule, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingsModule } from '../trainings/trainings.module';
import { UsersModule } from '../users/users.module';

import { SubscriptionController } from './subscription.controller';

import { PaypalService } from './paypal.service';
import { SubscriptionService } from "./subscriptions.service";

import { Subscription } from 'src/entities';

@Module({
  controllers: [SubscriptionController],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Subscription]),
    UsersModule,
    TrainingsModule
  ],
  providers: [
    SubscriptionService,
    PaypalService
  ]
})
export class SubscriptionModule {}