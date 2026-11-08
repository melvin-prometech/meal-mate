import { z } from 'zod';
import { CreateRecipeSchema } from './create.recipe.schema.js';

export const UpdateRecipeSchema = CreateRecipeSchema.partial();

export type UpdateRecipeDto = z.infer<typeof UpdateRecipeSchema>;