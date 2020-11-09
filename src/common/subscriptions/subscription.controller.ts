import { Controller, Get, Post, Patch, Query, Param } from "@nestjs/common";

import { PaymentMethods } from "src/constants";

import { SubscriptionService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) { }

  @Post()
  async create(
    @Query('idTraining') idTraining: number,
    @Query('idUser') idUser: number,
    @Query('method') method: PaymentMethods
  ) {
    return await this.subscriptionService.create(method, idTraining, idUser);
  }

  @Patch('activate/:id')
  async activate(@Param('id') id: number) {
    const result = await this.subscriptionService.activateSubscription(id);
    return {
      isActivated: result
    }
  }
}