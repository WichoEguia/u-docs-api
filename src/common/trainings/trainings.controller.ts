import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

import { TrainingTypes } from 'src/constants';

import { TrainingsService } from './trainings.service';
import { CreateTrainingDto, UpdateTrainingDto } from 'src/dto/training.dto';

@Controller('trainings')
export class TrainingsController {
  constructor(
    private trainingService: TrainingsService
  ) {}

  @Get()
  @ApiQuery({ name: 'type', enum: TrainingTypes, required: false })
  async findAll(@Query('type') type?: TrainingTypes) {
    return await this.trainingService.findAll(type);
  }

  @Get('search')
  @ApiQuery({ name: 'text', required: true })
  async search(@Query('text') text: string) {
    return await this.trainingService.findByText(text);
  }

  @Get('get/:id')
  async findById(@Param('id') id: number) {
    return await this.trainingService.findById(id);
  }

  @Post('create/:idUser')
  async create(
    @Body() trainingData: CreateTrainingDto,
    @Param('idUser') idUser: number
  ) {
    let trainingResponse = await this.trainingService.create(trainingData, idUser);
    delete trainingResponse.user;

    return trainingResponse;
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() trainingData: UpdateTrainingDto
  ) {
    return await this.trainingService.update(id, trainingData);
  }

  @Patch('deactivate/:id')
  async deactivate(@Param('id') id: number) {
    return {
      deleted: true,
      training: this.trainingService.deactivate(id)
    }
  }
}