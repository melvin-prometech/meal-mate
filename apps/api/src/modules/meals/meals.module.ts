import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from '../households/entities/household.entity.js';
import { HouseholdRecipe } from '../households/entities/household-recipe.entity.js';
import { Meal } from './entities/meal.entity.js';
import { MealsController } from './meals.controller.js';
import { MealsService } from './meals.service.js';
import { ShoppingListController } from './shopping-list.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, Household, HouseholdRecipe])],
  controllers: [MealsController, ShoppingListController],
  providers: [MealsService],
})
export class MealsModule {}
