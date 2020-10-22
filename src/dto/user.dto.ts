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