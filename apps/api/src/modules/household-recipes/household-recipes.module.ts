import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from '../households/entities/household.entity.js';
import { HouseholdMember } from '../households/entities/household-member.entity.js';
import { HouseholdRecipe } from '../households/entities/household-recipe.entity.js';
import { Recipe } from '../recipes/entities/recipe.entity.js';
import { HouseholdRecipesController } from './household-recipes.controller.js';
import { HouseholdRecipesService } from './household-recipes.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { HouseholdGuard } from '../auth/guards/household.guard.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([HouseholdRecipe, Household, HouseholdMember, Recipe, User]),
    AuthModule,
  ],
  controllers: [HouseholdRecipesController],
  providers: [HouseholdRecipesService, JwtAuthGuard, HouseholdGuard],
})
export class HouseholdRecipesModule {}
