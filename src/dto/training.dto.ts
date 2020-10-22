import { TrainingTypes } from 'src/constants';

export class CreateTrainingDto {
  title: string;
  description: string;
  type: TrainingTypes;
  storage: number;
  idUser: number;
}
