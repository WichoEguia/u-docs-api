import { Module } from "@nestjs/common";

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "src/common/auth/auth.module";
import { UsersModule } from "src/common/users/users.module";
import { TrainingsModule } from "./common/trainings/trainings.module";
import { SubscriptionModule } from './common/subscriptions/subscriptions.module';

import { AppController } from "./app.controller";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TrainingsModule,
    SubscriptionModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASS', 'demodemo'),
        database: configService.get<string>('DB_NAME', 'u-docs'),
        synchronize: true,
        entities: ["dist/**/*.entity.js"],
      })
    }),
  ],
  controllers: [AppController],
})
export class AppModule { }
