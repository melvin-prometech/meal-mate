import { RecipeResponseDto } from '@meal-mate/schemas';
import { Recipe } from '../entities/recipe.entity.js';

export function mapOneRecipeToResponseDto(recipe: Recipe): RecipeResponseDto {
  const { recipeIngredients, ...rest } = recipe;

  return {
    ...rest,
    ingredients: recipeIngredients ?? [],
  };
}

export function mapManyRecipesToResponseDto(recipes: Recipe[]): RecipeResponseDto[] {
  return recipes.map(mapOneRecipeToResponseDto);
}