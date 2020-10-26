import { SearchTrainingTypes } from "src/constants";

export class CreateTrainingDto {
  title: string;
  description: string;
  type: SearchTrainingTypes;
  storage: number;
}
