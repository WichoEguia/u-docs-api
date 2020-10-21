import { TrainingsService } from './trainings.service';
import { Controller, Get } from "@nestjs/common";
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
}