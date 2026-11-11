import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Household } from '../households/entities/household.entity.js';
import { HouseholdMember } from '../households/entities/household-member.entity.js';
import { HouseholdRecipe } from '../households/entities/household-recipe.entity.js';
import { Recipe } from '../recipes/entities/recipe.entity.js';
import { HouseholdRecipesController } from './household-recipes.controller.js';
import { HouseholdRecipesService } from './household-recipes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([HouseholdRecipe, Household, HouseholdMember, Recipe])],
  controllers: [HouseholdRecipesController],
  providers: [HouseholdRecipesService],
})
export class HouseholdRecipesModule {}
