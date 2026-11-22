import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from '../households/entities/household.entity.js';
import { HouseholdRecipe } from '../households/entities/household-recipe.entity.js';
import { Meal } from './entities/meal.entity.js';
import { MealsController } from './meals.controller.js';
import { MealsService } from './meals.service.js';
import { ShoppingListController } from './shopping-list.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { HouseholdGuard } from '../auth/guards/household.guard.js';
import { HouseholdAdminGuard } from '../auth/guards/household-admin.guard.js';
import { HouseholdMember } from '../households/entities/household-member.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, Household, HouseholdRecipe, HouseholdMember, User]), AuthModule],
  controllers: [MealsController, ShoppingListController],
  providers: [MealsService, JwtAuthGuard, HouseholdGuard, HouseholdAdminGuard],
})
export class MealsModule {}
