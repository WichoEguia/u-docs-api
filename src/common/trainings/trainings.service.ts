import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";

import { Training } from 'src/entities';
import { TrainingTypes } from './../../constants';
import { CreateTrainingDto } from './../../dto/training.dto';

import { UsersService } from 'src/common/users/users.service';

@Injectable()
export class TrainingsService {
  constructor(
    @InjectRepository(Training) private trainingRepository: Repository<Training>,
    private usersService: UsersService
  ) {}

  async findAll(type: TrainingTypes, instructorId?: number): Promise<Training[]> {
    if (instructorId) {
      return this.trainingRepository.find({
        where: {
          type,
          idUser: instructorId
        }
      });
    }
    return this.trainingRepository.find({ type });
  }

  async findById(id: number): Promise<Training> {
    const training = this.trainingRepository.findOne(id);

    if (training) {
      return training;
    }

    throw new HttpException(
      'No esxiste el curso solicitado',
      HttpStatus.NOT_FOUND
    );
  }

  async findByName(name: string): Promise<Training[]> {
    try {
      const findedTrainings = this.trainingRepository.find({
        title: Like(`%${name.trim()}%`),
        type: TrainingTypes.PUBLIC
      });
  
      if (findedTrainings) {
        return findedTrainings;
      }
  
      throw new HttpException(
        `No se encontró ningun curso que coincida con el titulo: ${name}`,
        HttpStatus.NOT_FOUND
      );
    } catch (error) {
      throw new HttpException(
        'Ha ocurrido un error al procesar su solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(trainingData: CreateTrainingDto): Promise<Training> {
    const newTraining = this.trainingRepository.create();

    newTraining.title = trainingData.title;
    newTraining.description = trainingData.description;
    newTraining.type = trainingData.type;
    newTraining.storage = trainingData.storage;
    newTraining.user = await this.usersService.findOne(null, trainingData.idUser);

    await this.trainingRepository.save(newTraining);
    return newTraining;
  }
}