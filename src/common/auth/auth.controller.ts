import { User } from 'src/entities/user.entity';
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from 'src/common/auth/auth.service';
import { CreateUserDto } from 'src/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto): Promise<User> {
    return await this.authService.register(userData);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<{ user: User, access_token: string }> {
    return this.authService.login(req.user);
  }
}
