import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HouseholdRecipeResponseSchema,
  HouseholdRecipeWithRecipeResponseSchema,
  type HouseholdRecipeResponseDto,
  type HouseholdRecipeWithRecipeResponseDto,
} from '@meal-mate/schemas';
import { Repository } from 'typeorm';
import { Household } from '../households/entities/household.entity.js';
import { HouseholdRecipe } from '../households/entities/household-recipe.entity.js';
import { Recipe } from '../recipes/entities/recipe.entity.js';
import { mapOneRecipeToResponseDto } from '../recipes/lib/recipes.mapper.js';

@Injectable()
export class HouseholdRecipesService {
  constructor(
    @InjectRepository(HouseholdRecipe)
    private readonly householdRecipeRepository: Repository<HouseholdRecipe>,
    @InjectRepository(Household)
    private readonly householdRepository: Repository<Household>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  async add(householdId: string, recipeId: string, addedBy: string): Promise<HouseholdRecipeResponseDto> {
    if (!(await this.householdRepository.exists({ where: { id: householdId } }))) {
      throw new NotFoundException(`Household with ID "${householdId}" not found`);
    }
    if (!(await this.recipeRepository.exists({ where: { id: recipeId } }))) {
      throw new NotFoundException(`Recipe with ID "${recipeId}" not found`);
    }
    if (await this.householdRecipeRepository.exists({ where: { householdId, recipeId } })) {
      throw new ConflictException('Recipe is already saved in this household');
    }

    const saved = await this.householdRecipeRepository.save(
      this.householdRecipeRepository.create({ householdId, recipeId, addedBy }),
    );
    return HouseholdRecipeResponseSchema.parse(saved);
  }

  async findByHousehold(householdId: string): Promise<HouseholdRecipeWithRecipeResponseDto[]> {
    if (!(await this.householdRepository.exists({ where: { id: householdId } }))) {
      throw new NotFoundException(`Household with ID "${householdId}" not found`);
    }
    const savedRecipes = await this.householdRecipeRepository.find({
      where: { householdId },
      relations: { 
        recipe: { 
          recipeIngredients: { 
            ingredient: true 
          } 
        } 
      },
      order: { createdAt: 'DESC' },
    });
    return savedRecipes.map(({ id, recipe }) =>
      HouseholdRecipeWithRecipeResponseSchema.parse({
        id,
        recipe: mapOneRecipeToResponseDto(recipe),
      }),
    );
  }

  async remove(householdId: string, recipeId: string): Promise<void> {
    if (!(await this.householdRepository.exists({ where: { id: householdId } }))) {
      throw new NotFoundException(`Household with ID "${householdId}" not found`);
    }
    const result = await this.householdRecipeRepository.delete({ householdId, recipeId });
    if (result.affected === 0) {
      throw new NotFoundException('Household recipe not found');
    }
  }
}
