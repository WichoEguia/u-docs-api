import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

import { Training } from 'src/entities';
import { TrainingsController } from "./trainings.controller";
import { TrainingsService } from './trainings.service';

import { UsersModule } from 'src/common/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Training]), UsersModule],
  controllers: [TrainingsController],
  providers: [TrainingsService]
})
export class TrainingsModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     .exclude('trainings', 'trainings/get/(.*)', 'trainings/search')
  //     .forRoutes(TrainingsController)
  // }
}