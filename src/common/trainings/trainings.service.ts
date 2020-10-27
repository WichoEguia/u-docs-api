import { UsersService } from 'src/common/users/users.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";

import { SearchTrainingTypes } from './../../constants';

import { Training } from 'src/entities';
import { CreateTrainingDto } from './../../dto/training.dto';

@Injectable()
export class TrainingsService {
  constructor(
    @InjectRepository(Training) private trainingRepository: Repository<Training>,
    private userService: UsersService
  ) {}

  async findAll(type: SearchTrainingTypes, idInstructor?: number): Promise<Training[]> {
    if (idInstructor) {
      if (type == SearchTrainingTypes.ALL) {
        return this.trainingRepository.find({
          where: {
            idUser: idInstructor
          }
        });
      }

      return this.trainingRepository.find({
        where: {
          type,
          idUser: idInstructor
        }
      });
    }

    if (type == SearchTrainingTypes.ALL) {
      return this.trainingRepository.find();
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
    const newTraining = this.trainingRepository.create(trainingData);
    newTraining.user = await this.userService.findOne(null, idUser);

    await this.trainingRepository.save(newTraining);
    return newTraining;
  }
}