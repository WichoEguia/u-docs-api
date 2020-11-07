import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";

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
    const token = await this.paypalService.getPaypalToken();
    // this.paypalSershis.paypalService.getBillingPlan(plan.id);
    return token;
  }
}