import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from 'express';

import { PaypalService } from './paypal.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private paypalService: PaypalService) { }

  @Get('paypal_test/:idPlan')
  async test(
    @Res() response: Response,
    @Param('idPlan') idPlan: string
  ) {
    const plan = {
      "name": "Plan with Regular and Trial Payment Definitions",
      "description": "Plan with regular and trial payment definitions.",
      "type": "FIXED",
      "payment_definitions": [
        {
          "name": "Regular payment definition",
          "type": "REGULAR",
          "frequency": "MONTH",
          "frequency_interval": "2",
          "amount": {
            "value": "100",
            "currency": "USD"
          },
          "cycles": "12",
          "charge_models": [
            {
              "type": "SHIPPING",
              "amount": {
                "value": "10",
                "currency": "USD"
              }
            },
            {
              "type": "TAX",
              "amount": {
                "value": "12",
                "currency": "USD"
              }
            }
          ]
        },
        {
          "name": "Trial payment definition",
          "type": "TRIAL",
          "frequency": "WEEK",
          "frequency_interval": "5",
          "amount": {
            "value": "9.19",
            "currency": "USD"
          },
          "cycles": "2",
          "charge_models": [
            {
              "type": "SHIPPING",
              "amount": {
                "value": "1",
                "currency": "USD"
              }
            },
            {
              "type": "TAX",
              "amount": {
                "value": "2",
                "currency": "USD"
              }
            }
          ]
        }
      ],
      "merchant_preferences": {
        "setup_fee": {
          "value": "1",
          "currency": "USD"
        },
        "return_url": "https://example.com",
        "cancel_url": "https://example.com/cancel",
        "auto_bill_amount": "YES",
        "initial_fail_amount_action": "CONTINUE",
        "max_fail_attempts": "0"
      }
    };

    this.getToken(
      token => {
        // this.paypalService
        //   .createBillingPlan(token, plan)
        //   .subscribe(res => response.json(res))
        // this.paypalService
        //   .getAllBillingPlans(token)
        //   .subscribe(res => response.json(res))
        this.paypalService
          .getBillingPlan(token, idPlan)
          .subscribe(res => response.json(res))
      }
    );
  }

  private getToken(callback: (token: string) => void) {
    this.paypalService
      .getPaypalToken()
      .subscribe(token => callback(token));
  }
}