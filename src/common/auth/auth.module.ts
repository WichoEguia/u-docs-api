import { Module } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { LocalStrategy } from "src/common/auth/strategies/local.strategy";
import { JwtStrategy } from "src/common/auth/strategies/jwt.strategy";
import { jwtConstants } from "src/constants";

import { AuthController } from "./auth.controller";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expirationTime },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
