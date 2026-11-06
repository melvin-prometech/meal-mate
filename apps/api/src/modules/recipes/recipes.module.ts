import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller.js';
import { RecipesService } from './recipes.service.js';
import { Recipe } from './entities/recipe.entity.js';
import { Ingredient } from '../ingredients/entities/ingredient.entity.js';
import { RecipeIngredient } from './entities/recipe-ingredient.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([
    Recipe,
    Ingredient,
    RecipeIngredient
  ])],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [TypeOrmModule]
})
export class RecipesModule {}
