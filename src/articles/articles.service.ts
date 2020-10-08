import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Article } from "./entities/article.entity";
import { CreateArticleDto } from "./dto/create-article.dto";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne(id);
    if (article) {
      return article;
    }
    throw new HttpException("Articulo no encontrado", HttpStatus.NOT_FOUND);
  }

  async create(articleData: CreateArticleDto): Promise<Article> {
    const newArticle = this.articleRepository.create(articleData);
    await this.articleRepository.save(newArticle);
    return newArticle;
  }
}
