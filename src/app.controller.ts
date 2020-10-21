import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  async helloWord() {
    return {
      name: "U-Docs",
      description: "Plataforma para impartir capacitaciones",
      authors: [
        "Luis Eguía",
        "Isaac Sandoval",
      ],
    };
  }
}
