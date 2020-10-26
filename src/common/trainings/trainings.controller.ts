import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";

import { SearchTrainingTypes } from 'src/constants';

import { TrainingsService } from './trainings.service';
import { CreateTrainingDto } from 'src/dto/training.dto';

@Controller('trainings')
export class TrainingsController {
  constructor(
    private trainingService: TrainingsService
  ) {}

  @Get()
  async findAll(
    @Query('type') type: SearchTrainingTypes,
    @Query('idInstructor') idInstructor?: number
  ) {
    if (idInstructor) {
      return await this.trainingService.findAll(type, idInstructor);  
    }
    return await this.trainingService.findAll(type);
  }

  @Get(':id')
  async findById(
    @Param('id') id: number
  ) {
    return await this.trainingService.findById(id);
  }

  @Get('search')
  async search(
    @Query('title') title: string
  ) {
    const courses = await this.trainingService.findByName(title);

    return {
      courses,
      count: courses.length
    }
  }

  @Post(':idUser')
  async create(
    @Body() trainingData: CreateTrainingDto,
    @Param('idUser') idUser: number
  ) {
    return await this.trainingService.create(trainingData, idUser);
  }
}