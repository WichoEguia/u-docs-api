import { UpdateTrainingDto } from './../../dto/training.dto';
import { UsersService } from 'src/common/users/users.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";

import { TrainingTypes } from 'src/constants';

import { Training } from 'src/entities';
import { CreateTrainingDto } from 'src/dto/training.dto';
import { join } from 'path';

@Injectable()
export class TrainingsService {
  constructor(
    @InjectRepository(Training) private trainingRepository: Repository<Training>,
    private userService: UsersService
  ) {}

  async findAll(type: TrainingTypes, idInstructor?: number): Promise<Training[]> {
    if (idInstructor) {
      if (!type) {
        return this.trainingRepository.find({
          where: {
            idUser: idInstructor
          },
          relations: ['user']
        });
      }

      return this.trainingRepository.find({
        where: {
          type,
          idUser: idInstructor
        },
        relations: ['user']
      });
    }

    if (!type) {
      return this.trainingRepository.find({
        relations: ['user']
      });
    }

    return this.trainingRepository.find({
      where: { type },
      relations: ['user']
    });
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

  async findByText(text: string): Promise<Training[]> {
    const findedTrainings = this.trainingRepository.find({
      where: [
        { title: Like(`%${text.trim()}%`) },
        { description: Like(`%${text.trim()}%`) }
      ]
    });

    if (findedTrainings) {
      return findedTrainings;
    }

    throw new HttpException(
      `No se encontró ningun curso que coincida con el titulo: ${text}`,
      HttpStatus.NOT_FOUND
    );
  }

  async create(trainingData: CreateTrainingDto, idUser: number): Promise<Training> {
    const newTraining = await this.trainingRepository.create(trainingData);
    newTraining.user = await this.userService.findOne(null, idUser);

    await this.trainingRepository.save(newTraining);
    return newTraining;
  }

  async update(idTraining: number, trainingData: UpdateTrainingDto): Promise<Training> {
    const training = await this.findById(idTraining);
    if (!training) {
      throw new HttpException(
        `No se encontró la capcitación con el id: ${idTraining}`,
        HttpStatus.NOT_FOUND
      );
    }

    training.title = trainingData.title || training.title,
    training.description = trainingData.description || training.description

    await this.trainingRepository.save(training);
    return training;
  }

  async deactivate(idTraining: number) {
    const training = await this.findById(idTraining);
    if (training) {
      throw new HttpException(
        `No se encontró la capcitación con el id: ${idTraining}`,
        HttpStatus.NOT_FOUND
      );
    }

    training.is_active = false;
    return training;
  }
}