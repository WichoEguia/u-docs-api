import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/dto';

import { AppRoles } from 'src/constants';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  async findAll(
    @Query('role') role?: AppRoles
  ): Promise<User[]> {
    return this.usersService.findAll(role);
  }

  @Get('search')
  async search(
    @Query('username') username: string,
    @Query('email') email: string
  ) {
    return await this.usersService.search(email, username);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() userData: UpdateUserDto
  ): Promise<User> {
    return await this.usersService.update(id, userData);
  }
}