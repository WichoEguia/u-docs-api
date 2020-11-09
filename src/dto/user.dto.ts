import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { AppRoles } from 'src/constants';

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  company?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsString()
  @IsEnum(AppRoles)
  role: AppRoles;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  avatar?: string;
}

export class UpdateUserDto {
  @IsString()
  @Length(5, 50)
  username: string;
  
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}