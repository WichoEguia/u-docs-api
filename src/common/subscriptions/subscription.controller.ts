import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from 'express';

import { PaypalService } from './paypal.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private paypalService: PaypalService) { }

  private getToken(callback: (token: string) => void) {
    this.paypalService
      .getPaypalToken()
      .subscribe(token => callback(token));
  }
}