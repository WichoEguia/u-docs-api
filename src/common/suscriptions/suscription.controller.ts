import { Controller, Get, Post, Param, Res } from "@nestjs/common";
import { Response } from 'express';

import { SuscriptionService } from './suscriptions.service';
import { PaypalService } from './paypal.service';

@Controller('suscriptions')
export class SuscriptionController {
  constructor(
    private suscriptionService: SuscriptionService,
    private paypalService: PaypalService
  ) { }

  // private getToken(callback: (token: string) => void) {
  //   this.paypalService
  //     .getPaypalToken()
  //     .subscribe(token => callback(token));
  // }

  @Get('create')
  async create() {
    return await this.suscriptionService.create();
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