import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RecipeFavoritesService } from './recipe-favorites.service.js';
import type { CreateFavoriteRecipeDto } from '@meal-mate/schemas';
import { RecipeResponseDto } from '@meal-mate/schemas';

@ApiTags('Favorite recipes')
@Controller('users/:userId/favorite-recipes') 
export class RecipeFavoritesController {
    constructor(private readonly favoritesService: RecipeFavoritesService) {}

    @Post()
    @ApiOperation({
        summary: 'Save a favorite recipe',
        description:
        'Saves a recipe using the required fields',
    })
    @ApiCreatedResponse({
        description: 'The recipe was successfully saved.',
    })
    @ApiBadRequestResponse({
        description: 'The request body is invalid.',
    })
    async add(
        @Param('userId') userId: string,
        @Body() dto: CreateFavoriteRecipeDto,
    ) {
        return await this.favoritesService.addFavorite(userId, dto.recipeId);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all favorite recipes for a user',
        description: 'Retrieves all saved favorite recipes for a specific user',
    })
    @ApiOkResponse({
        description: 'Successfully retrieved favorite recipes',
    })
    @ApiNotFoundResponse({
        description: 'User not found',
    })
    async getUserFavorites(
        @Param('userId') userId: string,
    ): Promise<RecipeResponseDto[]> {
        return await this.favoritesService.getUserFavorites(userId);
    }
}