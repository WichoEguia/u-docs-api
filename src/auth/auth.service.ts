import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async register(userData: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const createdUser = await this.usersService.create({
        ...userData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      throw new HttpException(
        'Ha ocurrido un error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async authenticateUser(
    email: string,
    plainTextPaword: string,
  ): Promise<User> {
    try {
      const user = await this.usersService.findOne(email);
      await this.validatePassword(plainTextPaword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Las credenciales son incorrectas',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async validatePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatch = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatch) {
      throw new HttpException(
        'Las credenciales son incorrectas',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async login(user: User) {
    return {
      user,
      access_token: this.jwtService.sign(user),
    };
  }
}
