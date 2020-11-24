import { Controller, Get, Post, Patch, Query, Param } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

import { PaymentMethods } from "src/constants";

import { SubscriptionService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) { }

  @Get()
  async getAll() {
    return await this.subscriptionService.getAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.subscriptionService.findById(id);
  }

  @Post()
  @ApiQuery({ name: 'idTraining', required: true })
  @ApiQuery({ name: 'idUser', required: true })
  @ApiQuery({ name: 'method', required: true })
  async create(
    @Query('idTraining') idTraining: number,
    @Query('idUser') idUser: number,
    @Query('method') method: PaymentMethods
  ) {
    return await this.subscriptionService.create(method, idTraining, idUser);
  }
}