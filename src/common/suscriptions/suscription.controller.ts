import { Controller, Get, Post, Param, Res } from "@nestjs/common";
import { Response } from 'express';

import { SuscriptionService } from './suscriptions.service';
import { PlanService } from './plan.service';

@Controller('suscriptions')
export class SuscriptionController {
  constructor(
    private suscriptionService: SuscriptionService,
    private planService: PlanService
  ) { }

  // private getToken(callback: (token: string) => void) {
  //   this.planService
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
  //       this.planService
  //         .activateBillingPlan(token, id)
  //         .subscribe(res_activate => {
            
  //         });
  //     }
  //   )
  // }
}