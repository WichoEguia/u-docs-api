import { HttpException, HttpService, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  private getPaypalBaseUrl(): string {
    const environment = this.configService.get<string>('NODE_ENV', 'development');
    return environment === 'production'
      ? 'https://api.paypal.com'
      : 'https://api.sandbox.paypal.com';
  }

  public getPaypalPlan(): any {
    const plan = {
      "name": "Subscripción U-DOCS",
      "description": "Subscripción mensual a la plataforma U-DOCS.",
      "type": "INFINITE",
      "payment_definitions": [
        {
          "name": "Subscripción mensualRegular payment definition a U-DOCS",
          "type": "REGULAR",
          "frequency": "MONTH",
          "frequency_interval": "1",
          "amount": {
            "value": "300",
            "currency": "MXN"
          },
          "cycles": "0"
        }
      ],
      "merchant_preferences": {
        "return_url": "https://example.com",
        "cancel_url": "https://example.com/cancel",
        "auto_bill_amount": "YES",
        "initial_fail_amount_action": "CONTINUE",
        "max_fail_attempts": "0"
      }
    };

    return plan;
  }

  public getPaypalToken(): Observable<string> {
    const requestUrl = `${this.paypalApiUrl}/v1/oauth2/token`;

    const headers = {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const auth = {
      'username': 'AWh0P8xLkJTvC8fl1EBpyNaunWJ7lEJxmNhfV5EGFURG5JajxmzujNvphew5Q0-fhna3J7kcL0Wyl97L',
      'password': 'EFSOx-xK8iq0Ni7CsjqyhnbFGLrWTfpCn7kJEUd1FAgQ2oW3aRrlHW-NyLfhvFaOHOEe6TDy0kD0YXxw'
    }

    try {
      return this.httpService.post(
        requestUrl,
        null,
        { headers, auth, params: { grant_type: 'client_credentials' } }
      ).pipe(
        map(
          (result: any) => {
            const { data } = result;
  
            if (!data.hasOwnProperty('access_token')) {
              throw new HttpException(
                'No se ha podido obtener el token',
                HttpStatus.INTERNAL_SERVER_ERROR
              );
            }
  
            return data.access_token;
          }
        )
      );
    } catch (error) {
      throw new HttpException(
        'No se ha podido obtener el token',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public createBillingPlan(token: string, paypalPlan: any): Observable<any> {
    const requestUrl = `${this.paypalApiUrl}/v1/payments/billing-plans/`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      return this.httpService.post(
        requestUrl,
        paypalPlan,
        { headers }
      ).pipe(
        map(
          res => {
            return {
              billing_plan: res.data
            }
          }
        )
      );
    } catch (error) {
      throw new HttpException(
        'No se ha podido crear el acuerdo de pago',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public getAllBillingPlans(token: string): Observable<any> {
    const requestUrl = `${this.paypalApiUrl}/v1/payments/billing-plans/`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      return this.httpService.get(
        requestUrl,
        { headers }
      ).pipe(
        map(
          res => {
            return {
              billing_plans: res.data.plans
            }
          }
        )
      )
    } catch (error) {
      throw new HttpException(
        'No se ha podido obtener los planes de pago',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public getBillingPlan(token: string, idPlan: string): Observable<any> {
    const requestUrl = `${this.paypalApiUrl}/v1/payments/billing-plans/${idPlan}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      return this.httpService.get(
        requestUrl,
        { headers }
      ).pipe(
        map(
          res => {
            return {
              billing_plan: res.data
            }
          }
        )
      )
    } catch (error) {
      throw new HttpException(
        'No se ha podido obtener el plan de pago',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public activateBillingPlan(idPlan: string) {

  }
}