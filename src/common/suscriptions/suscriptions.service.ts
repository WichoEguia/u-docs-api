import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Suscription } from 'src/entities';

import { PaypalService } from './paypal.service';

@Injectable()
export class SuscriptionService {
  constructor(
    @InjectRepository(Suscription) private suscriptionRepository: Repository<Suscription>,
    private paypalService: PaypalService
  ) { }

  async create() {
    // try {
      this.paypalService.setToken(
        await this.paypalService
          .getPaypalToken()
      );
      const plan = await this.paypalService.createBillingPlan();
      // return await this.paypalService.getBillingPlan(plan.id);
      return plan;
    // } catch (error) {
    //   // return error;
    //   throw new HttpException(
    //     `Ha ocurrido un error al procesar la solicitud`,
    //     HttpStatus.BAD_REQUEST
    //   )
    // }
  }
}