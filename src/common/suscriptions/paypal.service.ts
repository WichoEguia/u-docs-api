import { HttpException, HttpService, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

import { map } from 'rxjs/operators';
import { PaypalBillingPlan } from "src/constants";

@Injectable()
export class PaypalService {
  private paypalApiUrl: string;
  private token: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {
    this.paypalApiUrl = this.getPaypalBaseUrl();
  }

  public setToken(token) {
    this.token = token;
  }

  private getPaypalBaseUrl(): string {
    const environment = this.configService.get<string>('NODE_ENV', 'development');
    return environment === 'production'
      ? 'https://api.paypal.com'
      : 'https://api.sandbox.paypal.com';
  }

  public getPaypalPlan(): PaypalBillingPlan {
    const plan: PaypalBillingPlan = {
      name: "Subscripción U-DOCS",
      description: "Subscripción mensual a la plataforma U-DOCS",
      type: "INFINITE",
      payment_definitions: [
        {
          name: "Subscripción mensual a U-DOCS",
          type: "REGULAR",
          frequency: "MONTH",
          frequency_interval: "1",
          amount: {
            value: "300",
            currency: "MXN"
          },
          cycles: "0"
        }
      ],
      merchant_preferences: {
        return_url: "https://example.com",
        cancel_url: "https://example.com/cancel",
        auto_bill_amount: "YES",
        initial_fail_amount_action: "CONTINUE",
        max_fail_attempts: "1"
      }
    };

    return plan;
  }

  public async getPaypalToken(): Promise<string> {
    const requestUrl = `${this.paypalApiUrl}/v1/oauth2/token`;

    const headers = {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const auth = {
      'username': this.configService.get<string>('PAYPAL_KEY'),
      'password': this.configService.get<string>('PAYPAL_SECRET')
    }

    return this.httpService
      .post(requestUrl, null, { 
        headers, 
        auth, 
        params: { 
          grant_type: 'client_credentials' 
        }
      })
      .pipe(map(result => {
          const { data } = result;

          if (!data.hasOwnProperty('access_token')) {
            throw new HttpException(
              'No se ha podido obtener el token',
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          }

          return data.access_token;
        }
      ))
      .toPromise<string>();
  }

  public createBillingPlan(): Promise<unknown> {
    const requestUrl = `${this.paypalApiUrl}/v1/payments/billing-plans/`;

    const paypalPlan = this.getPaypalPlan();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };

    return this.httpService
      .post(requestUrl, paypalPlan, { headers })
      .pipe(map((res: any) => res.data))
      .toPromise();
  }

  public async getAllBillingPlans(): Promise<any> {
    const requestUrl = `${this.paypalApiUrl}/v1/payments/billing-plans/`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };

    return this.httpService
      .get(requestUrl, { headers })
      .pipe(map(res => res.data.plans))
      .toPromise();
  }

  public async getBillingPlan(idPlan: string): Promise<any> {
    const requestUrl = `${this.paypalApiUrl}/v1/payments/billing-plans/${idPlan}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };

    return this.httpService
      .get(requestUrl, { headers })
      .pipe(map(res => res.data))
      .toPromise();
  }

  public async activateBillingPlan(idPlan: string): Promise<void> {
    const requestUrl = `${this.paypalApiUrl}/v1/payments/billing-plans/${idPlan}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };

    const data = [
      {
        op: 'replace',
        path: '/',
        value: {
          state: 'ACTIVE'
        }
      }
    ];

    await this.httpService
      .patch(requestUrl, data, { headers })
      .pipe(map(res => res.data))
      .toPromise();
  }
}