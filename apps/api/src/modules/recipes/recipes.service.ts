import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import z from 'zod';
import { Repository } from 'typeorm';
import { CreateRecipeDto, RecipeResponseDto, RecipeResponseSchema } from "@meal-mate/schemas";
import { Recipe } from "./entities/recipe.entity.js";
import { Ingredient } from '../ingredients/entities/ingredient.entity.js';
import { RecipeIngredient } from './entities/recipe-ingredient.entity.js';


@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,

    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,

    @InjectRepository(RecipeIngredient)
    private readonly recipeIngredientRepository: Repository<RecipeIngredient>,
  ) {}

  async findAll(): Promise<RecipeResponseDto[]> {
    const recipes = await this.recipeRepository.find();

    return z.array(RecipeResponseSchema).parse(recipes);
  }

  async create(data: CreateRecipeDto): Promise<RecipeResponseDto> {
    const recipe = this.recipeRepository.create(data);
    const savedRecipe = await this.recipeRepository.save(recipe);
  
    return RecipeResponseSchema.parse(savedRecipe);
  }
}