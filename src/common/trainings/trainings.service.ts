import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";

import { Training } from 'src/entities';
import { TrainingTypes } from './../../constants';

@Injectable()
export class TrainingsService {
  constructor(
    @InjectRepository(Training) private trainingRepository: Repository<Training>
  ) {}

  async findAll(type: TrainingTypes): Promise<Training[]> {
    try {
      return this.trainingRepository.find({ type });
    } catch (error) {
      throw new HttpException(
        'Ha ocurrido un error al procesar su solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: number): Promise<Training> {
    try {
      const training = this.trainingRepository.findOne(id);
  
      if (training) {
        return training;
      }
  
      throw new HttpException(
        'No esxiste el curso solicitado',
        HttpStatus.NOT_FOUND
      );
    } catch (error) {
      throw new HttpException(
        'Ha ocurrido un error al procesar su solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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
}