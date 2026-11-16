import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MealResponseSchema,
  type CreateMealDto,
  type FindMealsDto,
  type MealResponseDto,
  type ShoppingListItemDto,
  type UpdateMealDto,
} from '@meal-mate/schemas';
import { Repository } from 'typeorm';
import { Household } from '../households/entities/household.entity.js';
import { HouseholdRecipe } from '../households/entities/household-recipe.entity.js';
import { Meal } from './entities/meal.entity.js';
import { toDateRange } from '../../lib/date-range.js';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    @InjectRepository(Household)
    private readonly householdRepository: Repository<Household>,
    @InjectRepository(HouseholdRecipe)
    private readonly householdRecipeRepository: Repository<HouseholdRecipe>,
  ) {}

  async findByHousehold(householdId: string, range: FindMealsDto): Promise<MealResponseDto[]> {
    await this.ensureHousehold(householdId);
    const date = toDateRange(range.from, range.to);
    const meals = await this.mealRepository.find({
      where: { householdRecipe: { householdId }, ...(date ? { date } : {}) },
      order: { date: 'ASC', createdAt: 'ASC' },
    });
    return meals.map((meal) => MealResponseSchema.parse(meal));
  }

  async getShoppingList(householdId: string, range: FindMealsDto): Promise<ShoppingListItemDto[]> {
    await this.ensureHousehold(householdId);
    const date = toDateRange(range.from, range.to);
    const meals = await this.mealRepository.find({
      where: { householdRecipe: { householdId }, ...(date ? { date } : {}) },
      relations: {
        householdRecipe: {
          recipe: {
            recipeIngredients: { ingredient: true },
          },
        },
      },
    });

    const items = new Map<string, ShoppingListItemDto>();
    for (const meal of meals) {
      for (const recipeIngredient of meal.householdRecipe.recipe.recipeIngredients) {
        const { ingredient, quantity, unit } = recipeIngredient;
        const key = `${ingredient.id}:${unit ?? ''}`;
        const existing = items.get(key);
        if (!existing) {
          items.set(key, {
            ingredientId: ingredient.id,
            name: ingredient.name,
            quantity,
            unit,
          });
        } else {
          existing.quantity = existing.quantity === null || quantity === null
            ? null
            : existing.quantity + quantity;
        }
      }
    }
    return [...items.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  async create(householdId: string, dto: CreateMealDto): Promise<MealResponseDto> {
    await this.ensureHousehold(householdId);
    if (!(await this.householdRecipeRepository.exists({ where: { id: dto.householdRecipeId, householdId } }))) {
      throw new NotFoundException('Household recipe not found');
    }
    await this.ensureDateIsAvailable(householdId, dto.date);
    const meal = this.mealRepository.create({ ...dto });
    try {
      return MealResponseSchema.parse(await this.mealRepository.save(meal));
    } catch (error) {
      this.throwIfDuplicate(error);
      throw error;
    }
  }

  async update(householdId: string, mealId: string, dto: UpdateMealDto): Promise<MealResponseDto> {
    await this.ensureHousehold(householdId);
    const meal = await this.mealRepository.findOne({
      where: { id: mealId, householdRecipe: { householdId } },
    });
    if (!meal) throw new NotFoundException('Meal not found');
    if (dto.date) await this.ensureDateIsAvailable(householdId, dto.date, mealId);
    Object.assign(meal, dto);
    try {
      return MealResponseSchema.parse(await this.mealRepository.save(meal));
    } catch (error) {
      this.throwIfDuplicate(error);
      throw error;
    }
  }

  async remove(householdId: string, mealId: string): Promise<void> {
    await this.ensureHousehold(householdId);
    const meal = await this.mealRepository.findOne({
      where: { id: mealId, householdRecipe: { householdId } },
    });
    if (!meal) throw new NotFoundException('Meal not found');
    await this.mealRepository.remove(meal);
  }

  private async ensureHousehold(householdId: string): Promise<void> {
    if (!(await this.householdRepository.exists({ where: { id: householdId } }))) {
      throw new NotFoundException(`Household with ID "${householdId}" not found`);
    }
  }

  private async ensureDateIsAvailable(householdId: string, date: string, excludeMealId?: string): Promise<void> {
    const query = this.mealRepository
      .createQueryBuilder('meal')
      .innerJoin('meal.householdRecipe', 'householdRecipe')
      .where('householdRecipe.householdId = :householdId', { householdId })
      .andWhere('meal.date = :date', { date });
    if (excludeMealId) query.andWhere('meal.id <> :excludeMealId', { excludeMealId });
    const existingMeal = await query.getOne();
    if (existingMeal) throw new ConflictException('A meal is already planned for this date');
  }

  private throwIfDuplicate(error: unknown): void {
    if (
      typeof error === 'object' && error !== null && 'code' in error &&
      (error.code === 'ER_DUP_ENTRY' || error.code === '23505')
    ) {
      throw new ConflictException('Recipe is already planned for that date');
    }
  }
}
