import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppRoles } from 'src/constants';

import { CreateUserDto } from 'src/dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(role?: AppRoles): Promise<User[]> {
    const condition = role ? { role } : null;
    
    const users = await this.userRepository.find(condition);
    users.forEach(user => user.password = null);

    return users;
  }

  async findOne(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (user) {
      return user;
    }

    throw new HttpException(
      'El usuario no existe en nuestra base de datos',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto): Promise<User> {
    const userWithSameEmail = await this.findByEmail(userData.email);
    if (userWithSameEmail) {
      throw new HttpException(
        'Ya existe un usuario con ese correo',
        HttpStatus.FORBIDDEN,
      );
    }

    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);

    return newUser;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  private async findByEmail(email: string): Promise<User | false> {
    const finded = await this.userRepository.findOne({ email });
    return finded ? finded : false;
  }
}
