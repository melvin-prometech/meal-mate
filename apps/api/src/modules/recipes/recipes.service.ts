import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import z from 'zod';
import { Repository } from 'typeorm';
import { RecipeResponseDto, RecipeResponseSchema } from "@meal-mate/schemas";
import { Recipe } from "./entities/recipe.entity.js";


@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
  ) {}

  async findAll(): Promise<RecipeResponseDto[]> {
    const recipes = await this.recipesRepository.find();

    return z.array(RecipeResponseSchema).parse(recipes);
  }
}