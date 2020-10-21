import { Controller, Request, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly uaersService: UsersService
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.uaersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async profile(@Request() req): Promise<User> {
    return req.user
  }
}