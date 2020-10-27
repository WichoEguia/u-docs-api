import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";

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
    @Query('type') type: SearchTrainingTypes = SearchTrainingTypes.ALL,
    @Query('idInstructor') idInstructor?: number
  ) {
    if (idInstructor) {
      return await this.trainingService.findAll(type, idInstructor);  
    }
    return await this.trainingService.findAll(type);
  }

  @Get('search')
  async search(
    @Query('text') text: string
  ) {
    return await this.trainingService.findByText(text);
  }

  @Get('get/:id')
  async findById(
    @Param('id') id: number
  ) {
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
}