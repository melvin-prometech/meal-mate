import { z } from 'zod';
import { RecipeResponseSchema } from '../../recipes/create.recipe.schema.js';

export const HouseholdRecipeResponseSchema = z.object({
  id: z.uuid(),
  householdId: z.uuid(),
  recipeId: z.uuid(),
  addedBy: z.uuid(),
  createdAt: z.date(),
});

export const HouseholdRecipeWithRecipeResponseSchema = z.object({
  id: z.uuid(),
  recipe: RecipeResponseSchema,
});

export type HouseholdRecipeResponseDto = z.infer<typeof HouseholdRecipeResponseSchema>;
export type HouseholdRecipeWithRecipeResponseDto = z.infer<
  typeof HouseholdRecipeWithRecipeResponseSchema
>;
