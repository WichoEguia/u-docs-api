import { Controller, Get, Post, Query } from "@nestjs/common";

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