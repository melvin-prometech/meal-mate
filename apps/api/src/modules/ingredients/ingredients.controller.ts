import { ApiTags } from "@nestjs/swagger";
import { Controller } from "@nestjs/common";
import { IngredientsService } from "./ingredients.module.js";

@ApiTags('Ingredients')
@Controller('Ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}
}