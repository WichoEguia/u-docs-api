import { Controller, Get, Query } from '@nestjs/common';

import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';

import { AppRoles } from 'src/constants';

@Controller('users')
export class UsersController {
  constructor(
    private readonly uaersService: UsersService
  ) {}

  @Get()
  async findAll(@Query('role') role?: AppRoles): Promise<User[]> {
    return this.uaersService.findAll(role);
  }
}