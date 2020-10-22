import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/common/users/users.service';
import { CreateUserDto } from 'src/dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async register(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const createdUser = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    createdUser.password = undefined;

    return createdUser;
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
    const payload = {
      id: user.idUser,
      username: user.username,
      email: user.email,
      isActive: user.is_active,
      role: user.role,
      company: user.company,
      age: user.age,
      phone: user.phone,
      avatar: user.avatar
    };

    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
