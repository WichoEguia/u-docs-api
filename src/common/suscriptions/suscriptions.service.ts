import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Suscription } from 'src/entities';

import { PlanService } from './plan.service';

@Injectable()
export class SuscriptionService {
  constructor(
    @InjectRepository(Suscription) private suscriptionRepository: Repository<Suscription>,
    private planServiec: PlanService
  ) { }

  async create() {
    const token = await this.planServiec.getPaypalToken();
    // this.paypalSershis.planServiec.getBillingPlan(plan.id);
    return token;
  }
}