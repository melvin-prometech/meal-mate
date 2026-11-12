import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MealResponseSchema,
  type CreateMealDto,
  type FindMealsDto,
  type MealResponseDto,
  type UpdateMealDto,
} from '@meal-mate/schemas';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Household } from '../households/entities/household.entity.js';
import { HouseholdRecipe } from '../households/entities/household-recipe.entity.js';
import { Meal } from './entities/meal.entity.js';

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
    const date = range.from && range.to
      ? Between(range.from, range.to)
      : range.from
        ? MoreThanOrEqual(range.from)
        : range.to
          ? LessThanOrEqual(range.to)
          : undefined;
    const meals = await this.mealRepository.find({
      where: { householdRecipe: { householdId }, ...(date ? { date } : {}) },
      order: { date: 'ASC', createdAt: 'ASC' },
    });
    return meals.map((meal) => MealResponseSchema.parse(meal));
  }

  async create(householdId: string, dto: CreateMealDto): Promise<MealResponseDto> {
    await this.ensureHousehold(householdId);
    if (!(await this.householdRecipeRepository.exists({ where: { id: dto.householdRecipeId, householdId } }))) {
      throw new NotFoundException('Household recipe not found');
    }
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

  private throwIfDuplicate(error: unknown): void {
    if (
      typeof error === 'object' && error !== null && 'code' in error &&
      (error.code === 'ER_DUP_ENTRY' || error.code === '23505')
    ) {
      throw new ConflictException('Recipe is already planned for that date');
    }
  }
}
