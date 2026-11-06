import { z } from 'zod';
import { CreateRecipeIngredientSchema } from './create.recipe-ingredient.schema.js';
import { RecipeIngredientResponseSchema } from './create.recipe-ingredient.schema.js';

export const CreateRecipeSchema = z.object({
  title: z.string().min(2),
  description: z.string().nullable().optional(),
  instructions: z.string().min(1),
  prepTime: z.number().int().nonnegative(),
  servings: z.number().int().positive(),
  createdBy: z.uuid().nullable().optional(),
  ingredients: z.array(CreateRecipeIngredientSchema).min(1),
});

export const CreateRecipeResponseSchema = z.object({
  id: z.uuid(),
});

export const RecipeResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  instructions: z.string(),
  prepTime: z.number(),
  servings: z.number(),
  createdBy: z.uuid().nullable().optional(),
  ingredients: z.array(RecipeIngredientResponseSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateRecipeDto = z.infer<typeof CreateRecipeSchema>;
export type CreateRecipeResponseDto = z.infer<typeof CreateRecipeResponseSchema>;
export type RecipeResponseDto = z.infer<typeof RecipeResponseSchema>;