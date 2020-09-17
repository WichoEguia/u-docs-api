import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";

import { UsersService, User } from '../../users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user: User = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    return {
      user,
      access_token: this.jwtService.sign(user)
    }
  }
}
