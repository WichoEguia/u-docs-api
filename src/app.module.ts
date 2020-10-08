import { ArticlesModule } from "./articles/atricles.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

import { AppController } from "./app.controller";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ArticlesModule,
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
export class AppModule {}
