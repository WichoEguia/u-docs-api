import { HttpModule, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

import { SuscriptionController } from './suscription.controller';

import { PlanService } from './plan.service';
import { SuscriptionService } from "./suscriptions.service";

import { Suscription } from 'src/entities';

@Module({
  controllers: [SuscriptionController],
  imports: [HttpModule, TypeOrmModule.forFeature([Suscription])],
  providers: [SuscriptionService, PlanService]
})
export class SuscriptionModule {}