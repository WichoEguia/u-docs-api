import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(
      {
        "type": "mysql",
        "host": "db",
        "port": 3306,
        "username": "root",
        "password": "demodemo",
        "database": "u-docs",
        "synchronize": true,
        "entities": ["dist/**/*.entity.js"]
      }
    )
  ],
  controllers: [AppController]
})
export class AppModule {}
