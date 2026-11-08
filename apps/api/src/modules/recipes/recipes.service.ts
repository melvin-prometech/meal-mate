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
import { mapManyRecipesToResponseDto, mapOneRecipeToResponseDto } from './lib/recipes.mapper.js';


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

    const formattedRecipes = mapManyRecipesToResponseDto(recipes)

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

    const formattedRecipe = mapOneRecipeToResponseDto(recipe);

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

  async updateRecipe(
    id: string,
    data: Partial<CreateRecipeDto>,
  ): Promise<CreateRecipeResponseDto> {
    return this.recipeRepository.manager.transaction(async (manager) => {
      const recipeRepo = manager.getRepository(Recipe);
      const ingredientRepo = manager.getRepository(Ingredient);
      const recipeIngredientRepo = manager.getRepository(RecipeIngredient);

      const recipe = await recipeRepo.findOne({ where: { id } });

      if (!recipe) {
        throw new NotFoundException(`Recipe with ID "${id}" not found`);
      }

      const { ingredients, ...recipeData } = data;

      if (Object.keys(recipeData).length > 0) {
        await recipeRepo.update(id, recipeData);
      }

      if (ingredients) {
        await recipeIngredientRepo.delete({ recipeId: id });

        for (const ingredientData of ingredients) {
          const ingredient = await this.ingredientsService.findOrCreate(
            ingredientData.name,
            ingredientRepo,
          );

          const recipeIngredient = recipeIngredientRepo.create({
            recipeId: id,
            ingredientId: ingredient.id,
            quantity: ingredientData.quantity,
            unit: ingredientData.unit,
            notes: ingredientData.notes,
          });

          await recipeIngredientRepo.save(recipeIngredient);
        }
      }

      return { id: recipe.id}
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.recipeRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}