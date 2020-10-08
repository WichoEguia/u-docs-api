import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { Article } from "./entities/article.entity";

@Controller("articles")
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  async getAll(): Promise<Article[]> {
    return await this.articlesService.findAll();
  }

  @Get(":id")
  async getOne(@Param() id: number): Promise<Article> {
    return await this.articlesService.findOne(id);
  }

  @Post("new")
  async create(@Body() body: CreateArticleDto): Promise<Article> {
    return await this.articlesService.create(body);
  }
}
