import { HttpModule, Module } from "@nestjs/common";

import { SubscriptionController } from './subscription.controller';

import { PaypalService } from './paypal.service';
import { SubscriptionService } from "./subscriptions.service";

@Module({
  controllers: [SubscriptionController],
  imports: [HttpModule],
  providers: [SubscriptionService, PaypalService]
})
export class SubscriptionModule {}