import { IsEnum, IsString, Length } from "class-validator";
import { TrainingTypes } from "src/constants";

export class CreateTrainingDto {
  @Length(1, 250)
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsEnum(TrainingTypes)
  type: TrainingTypes;
}

export class UpdateTrainingDto {
  @Length(1, 250)
  title: string;

  @IsString()
  description: string;
}
