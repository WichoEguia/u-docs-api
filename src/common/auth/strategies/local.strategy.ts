import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from 'src/services/auth.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user: User = await this.authService.authenticateUser(email, password);
    if (!user) {
      throw new HttpException(
        'Credenciales incorrectas',
        HttpStatus.FORBIDDEN
      );
    }
    return user;
  }
}
