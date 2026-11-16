
import { Param, Body, Controller, Get, Post, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { RecipesService } from './recipes.service.js';
import {
  CreateRecipeSchema,
  RecipeResponseSchema
} from '@meal-mate/schemas';

import type {
  CreateRecipeDto,
  CreateRecipeResponseDto,
  RecipeResponseDto,
  UpdateRecipeDto
} from '@meal-mate/schemas';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../../types/authenticated-request.js';


@ApiTags('Recipes')
@Controller('recipes')
@UseGuards(JwtAuthGuard)
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
    @Body({ schema: CreateRecipeSchema }) data: CreateRecipeDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<CreateRecipeResponseDto> {
    return this.recipesService.createRecipe(data, request.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a recipe',
    description: 'Retrieve a recipe by their ID.',
  })
  @ApiOkResponse({
    description: 'Recipe retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found.',
  })
  async findOne(@Param('id') id: string): Promise<RecipeResponseDto> {
    const recipe = await this.recipesService.findOne(id);
    
    return RecipeResponseSchema.parse(recipe);
  }
  
  @Patch(':id')
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiOkResponse({
    description: 'Recipe updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<CreateRecipeResponseDto> {
    return this.recipesService.updateRecipe(id, updateRecipeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recipe' })
  @ApiOkResponse({
    description: 'Recipe deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.recipesService.remove(id);
  }
}
