import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  async hello() {
    return {
      name: "U-Docs",
      description: "API para plataforma U-Docs. Una plataforma para impartir capacitaciones industriales.",
      authors: [
        "Luis Eguía",
        "Isaac Sandoval",
      ],
    };
  }
}
