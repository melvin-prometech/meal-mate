import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteRecipe } from './entities/recipe-favorite.entity.js';
import { UsersService } from '../users/users.service.js';
import { Recipe } from './entities/recipe.entity.js';
import { RecipeResponseDto } from '@meal-mate/schemas';
import { RecipesService } from './recipes.service.js';
import { mapManyRecipesToResponseDto } from './lib/recipes.mapper.js';

@Injectable()
export class RecipeFavoritesService {
    constructor(
        @InjectRepository(FavoriteRecipe)
        private readonly favoriteRepository: Repository<FavoriteRecipe>,

        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,

        private readonly recipesService: RecipesService,
        private readonly usersService: UsersService
    ) {}

    async addFavorite(userId: string, recipeId: string): Promise<FavoriteRecipe> {
        if (!await this.usersService.exists(userId)) {
            throw new NotFoundException('User not found');
        }

        const recipeExists = await this.recipeRepository.exists({ where: { id: recipeId } });
        if (!recipeExists) {
        throw new NotFoundException(`Recipe with ID "${recipeId}" not found`);
        }

        const existing = await this.favoriteRepository.findOne({
        where: { userId, recipeId },
        });

        if (existing) {
        throw new ConflictException('Recipe is already in favorites');
        }

        const favorite = this.favoriteRepository.create({ userId, recipeId });
        return await this.favoriteRepository.save(favorite);
    }

    async getUserFavorites(userId: string): Promise<RecipeResponseDto[]> {
        if (!await this.usersService.exists(userId)) {
            throw new NotFoundException('User not found');
        }
        
        const favorites = await this.favoriteRepository.find({
            where: { userId },
            relations: {
                recipe: {
                    recipeIngredients: {
                        ingredient: true, 
                    },
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });

        const recipes = favorites.map((fav) => fav.recipe);
        
        return mapManyRecipesToResponseDto(recipes)
    }
}  