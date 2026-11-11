import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller.js';
import { RecipesService } from './recipes.service.js';
import { Recipe } from './entities/recipe.entity.js';
import { RecipeIngredient } from './entities/recipe-ingredient.entity.js';
import { IngredientsModule } from '../ingredients/ingredients.module.js';
import { UsersModule } from '../users/users.module.js';
import { RecipeFavoritesController } from './recipe-favorites.controller.js';
import { FavoriteRecipe } from './entities/recipe-favorite.entity.js';
import { RecipeFavoritesService } from './recipe-favorites.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      RecipeIngredient,
      FavoriteRecipe
    ]),
    UsersModule,
    IngredientsModule,
  ],
  controllers: [RecipesController, RecipeFavoritesController],
  providers: [RecipesService, RecipeFavoritesService],
})
export class RecipesModule {}
