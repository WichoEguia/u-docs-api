import { AppRoles } from 'src/constants';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  company?: string;
  age?: number;
  role: AppRoles;
  phone?: string;
  avatar?: string;
}

export class UpdateUserDto {
  username: string;
  password: string;
  company?: string;
  age?: number;
  phone?: string;
  avatar?: string;
}