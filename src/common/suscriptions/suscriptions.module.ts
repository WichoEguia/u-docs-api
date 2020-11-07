import { HttpModule, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

import { SuscriptionController } from './suscription.controller';

import { PaypalService } from './paypal.service';
import { SuscriptionService } from "./suscriptions.service";

import { Suscription } from 'src/entities';

@Module({
  controllers: [SuscriptionController],
  imports: [HttpModule, TypeOrmModule.forFeature([Suscription])],
  providers: [SuscriptionService, PaypalService]
})
export class SuscriptionModule {}