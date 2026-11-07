import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import z from 'zod';
import { Repository } from 'typeorm';
import { CreateRecipeDto, CreateRecipeResponseDto, RecipeResponseDto, RecipeResponseSchema } from "@meal-mate/schemas";
import { Recipe } from "./entities/recipe.entity.js";
import { Ingredient } from '../ingredients/entities/ingredient.entity.js';
import { RecipeIngredient } from './entities/recipe-ingredient.entity.js';
import { IngredientsService } from '../ingredients/ingredients.service.js';
import { UsersService } from '../users/users.service.js';


@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private readonly usersService: UsersService,
    private readonly ingredientsService: IngredientsService,
  ) {}

  async findAll(): Promise<RecipeResponseDto[]> {
    const recipes = await this.recipeRepository.find({
      relations: {
        recipeIngredients: {
          ingredient: true,
        },
      },
    });

    const formattedRecipes = this.mapManyToResponseDto(recipes);

    return z.array(RecipeResponseSchema).parse(formattedRecipes);
  }

  async findOne(id: string): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: {
        recipeIngredients: {
          ingredient: true,
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID "${id}" not found`);
    }

    const formattedRecipe = this.mapOneToResponseDto(recipe);

    return RecipeResponseSchema.parse(formattedRecipe);
  }

  async createRecipe(
    data: CreateRecipeDto,
  ): Promise<CreateRecipeResponseDto> {
    return this.recipeRepository.manager.transaction(async (manager) => {

      const recipeRepo = manager.getRepository(Recipe);
      const ingredientRepo = manager.getRepository(Ingredient);
      const recipeIngredientRepo = manager.getRepository(RecipeIngredient);

      const { ingredients, ...recipeData } = data;

      if (data.createdBy && !(await this.usersService.exists(data.createdBy))) {
        throw new NotFoundException('User not found');
      }

      const recipe = recipeRepo.create(recipeData);
      const savedRecipe = await recipeRepo.save(recipe);

      for (const ingredientData of ingredients) {
        const ingredient = await this.ingredientsService.findOrCreate(
          ingredientData.name,
          ingredientRepo,
        );

        const recipeIngredientData: DeepPartial<RecipeIngredient> = {
          recipeId: savedRecipe.id,
          ingredientId: ingredient.id,
          quantity: ingredientData.quantity,
          unit: ingredientData.unit,
          notes: ingredientData.notes,
        };

        const recipeIngredient = recipeIngredientRepo.create(recipeIngredientData);

        await recipeIngredientRepo.save(recipeIngredient);
      }

      return { id: savedRecipe.id} ;
    });
  }

  private mapOneToResponseDto(
    recipe: Recipe,
  ): RecipeResponseDto {
    const { recipeIngredients, ...rest } = recipe;

    return {
      ...rest,
      ingredients: recipeIngredients ?? [],
    };
  }

  private mapManyToResponseDto(
    recipes: Recipe[],
  ): RecipeResponseDto[] {
    return recipes.map((recipe) => this.mapOneToResponseDto(recipe));
  }
}