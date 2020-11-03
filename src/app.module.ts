import { Module } from "@nestjs/common";
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
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "demodemo",
      database: "u-docs",
      synchronize: true,
      entities: ["dist/**/*.entity.js"],
    }),
  ],
  controllers: [AppController],
})
export class AppModule { }
