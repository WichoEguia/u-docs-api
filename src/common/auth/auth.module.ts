import { Module } from "@nestjs/common";

import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from "../auth/auth.service";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { LocalStrategy } from "src/common/auth/strategies/local.strategy";
import { JwtStrategy } from "src/common/auth/strategies/jwt.strategy";

import { AuthController } from "./auth.controller";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'secretKey'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION', '12h') },
      })
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}
