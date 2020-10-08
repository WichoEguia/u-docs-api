import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";
import { Article } from "./entities/article.entity";

@Module({
  controllers: [ArticlesController],
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticlesService],
})
export class ArticlesModule {}
