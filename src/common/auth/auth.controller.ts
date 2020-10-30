import { User } from 'src/entities/user.entity';
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { LocalAuthGuard } from 'src/guards/local.guard';

import { AuthService } from 'src/common/auth/auth.service';
import { CreateUserDto } from 'src/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() userData: CreateUserDto
  ): Promise<User> {
    return await this.authService.register(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req
  ): Promise<{ user: User, access_token: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(
    @Request() req
  ): Promise<User> {
    return req.user
  }
}
