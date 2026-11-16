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
import { AuthModule } from '../auth/auth.module.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      RecipeIngredient,
      FavoriteRecipe
    ]),
    UsersModule,
    IngredientsModule,
    AuthModule,
  ],
  controllers: [RecipesController, RecipeFavoritesController],
  providers: [RecipesService, RecipeFavoritesService, JwtAuthGuard],
})
export class RecipesModule {}
