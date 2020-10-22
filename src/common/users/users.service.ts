import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { AppRoles } from 'src/constants';

import { User } from 'src/entities';
import { CreateUserDto, UpdateUserDto } from 'src/dto';

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

  async search(email?: string, name?: string): Promise<User[]> {
    let searchCriteria = null;

    if (email && name) {
      searchCriteria = {
        where: {
          username: Like(name),
          email: Like(email)
        }
      };
    } else if (email) {
      searchCriteria = {
        where: {
          email: Like(email)
        }
      };
    } else if (name) {
      searchCriteria = {
        where: {
          username: Like(name)
        }
      };
    } else {
      throw new HttpException(
        'Necesita ingresar un criterio de busqueda',
        HttpStatus.NOT_FOUND,
      );
    }

    const findedUser = await this.findByCriteria(searchCriteria);
    if (!findedUser) {
      throw new HttpException(
        'Sin resultados',
        HttpStatus.NOT_FOUND
      );
    }

    return findedUser;
  }

  async findOne(email?: string, id?: number): Promise<User> {
    let searchCriteria = null;
    
    if (email) {
      searchCriteria = { email };
    } else if (id) {
      searchCriteria = { idUser: id };
    } else {
      throw new HttpException(
        'Estaablesca un parametro de busqueda',
        HttpStatus.BAD_REQUEST,
      );
    }

    const searchResult = await this.findByCriteria(searchCriteria);
    if (!searchResult) {
      throw new HttpException(
        'El usuario no existe en nuestra base de datos',
        HttpStatus.NOT_FOUND,
      );
    }

    return searchResult[0];
  }

  async create(userData: CreateUserDto): Promise<User> {
    const usersWithSameEmail = await this.findByCriteria({ email: userData.email });
    if (usersWithSameEmail && usersWithSameEmail.length) {
      throw new HttpException(
        'Ya existe un usuario con ese correo',
        HttpStatus.FORBIDDEN,
      );
    }

    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);

    return newUser;
  }

  async update(idUser: number, userData: UpdateUserDto): Promise<User> {
    const searchResult = await this.findByCriteria({ idUser });
    if (!searchResult) {
      throw new HttpException(
        `No se encontró al usuario con el id: ${idUser}`,
        HttpStatus.NOT_FOUND
      );
    }

    const user = searchResult[0];
    user.username = userData.username || user.username;
    user.age = userData.age || user.age;
    user.company = userData.company || user.company;
    user.phone = userData.phone || user.phone;
    user.password = userData.password || user.password;
    user.avatar = userData.avatar || user.avatar;

    await this.userRepository.save(user);
    user.password = null;

    return user;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  private async findByCriteria(condition: any): Promise<User[] | false> {
    const finded = await this.userRepository.find(condition);
    return finded.length > 0 ? finded : false;
  }
}
