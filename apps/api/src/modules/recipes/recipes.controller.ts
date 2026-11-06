
import { Param, Body, Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { RecipesService } from './recipes.service.js';
import { RecipeResponseDto, CreateRecipeDto, CreateRecipeResponseSchema } from '@meal-mate/schemas';


@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({
    summary: 'List recipes',
    description:
      'List all recipes',
  })
  @ApiOkResponse({
    description: 'All recipes listed successfully.',
  })
  @ApiBadRequestResponse({
    description: 'The request body is invalid.',
  })
  async findAll(): Promise<RecipeResponseDto[]> {
    return this.recipesService.findAll();
  }

  @Post()
    @ApiOperation({
      summary: 'Create a recipe',
      description:
        'Creates a new recipe using the required fields',
    })
    @ApiCreatedResponse({
      description: 'The recipe was successfully created.',
    })
    @ApiBadRequestResponse({
      description: 'The request body is invalid.',
    })
    async createUser(
      @Body({ schema: CreateRecipeResponseSchema }) data: CreateRecipeDto,
    ): Promise<CreateRecipeDto> {
      return this.recipesService.create(data);
    }
}