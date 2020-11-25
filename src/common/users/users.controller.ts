import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { User } from 'src/entities/user.entity';
import { UsersService } from '../../services/users.service';
import { UpdateUserDto } from 'src/dto';

import { AppRoles } from 'src/constants';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  @ApiQuery({ name: 'role', enum: AppRoles, required: false })
  async findAll(@Query('role') role: AppRoles = AppRoles.STUDENT): Promise<User[]> {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get('search')
  @ApiQuery({ name: 'username', required: false })
  @ApiQuery({ name: 'email', required: false })
  async search(
    @Query('username') username: string,
    @Query('email') email: string
  ) {
    return await this.usersService.search(email, username);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() userData: UpdateUserDto
  ): Promise<User> {
    return await this.usersService.update(id, userData);
  }
}