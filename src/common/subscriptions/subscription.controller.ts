import { Controller, Get, Post, Query } from "@nestjs/common";
import { Response } from 'express';

import { SubscriptionService } from './subscriptions.service';
import { PaypalService } from './paypal.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService,
    private paypalService: PaypalService
  ) { }

  @Post()
  async create(
    @Query('idTraining') idTraining: number,
    @Query('idUser') idUser: number
  ) {
    return await this.subscriptionService.create(idTraining, idUser);
  }

  // @Post('activate/:idPlan')
  // activate(
  //   @Res() response: Response,
  //   @Param('idPlan') id: string
  // ) {
  //   this.getToken(
  //     token => {
  //       this.paypalService
  //         .activateBillingPlan(token, id)
  //         .subscribe(res_activate => {
            
  //         });
  //     }
  //   )
  // }
}