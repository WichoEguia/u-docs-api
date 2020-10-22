import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";

import { TrainingsService } from './trainings.service';
import { CreateTrainingDto } from 'src/dto/training.dto';
import { TrainingTypes } from 'src/constants';

@Controller('trainings')
export class Trainings {
  constructor(
    private trainingService: TrainingsService
  ) {}

  @Get()
  async findAll() {
    return await this.trainingService.findAll(TrainingTypes.PRIVATE);
  }

  @Get(':id')
  async findById(
    @Param('id') id: number
  ) {
    return await this.trainingService.findById(id);
  }

  @Get()
  async search(
    @Query('title') title: string
  ) {
    const courses = await this.trainingService.findByName(title);

    return {
      courses,
      count: courses.length
    }
  }

  @Post()
  async create(
    @Body() trainingData: CreateTrainingDto
  ) {
    return await this.trainingService.create(trainingData);
  }
}