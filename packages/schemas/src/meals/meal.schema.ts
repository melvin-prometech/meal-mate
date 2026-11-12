import { z } from 'zod';

export const CreateMealSchema = z.object({
  householdRecipeId: z.uuid(),
  date: z.iso.date(),
  notes: z.string().nullable().optional(),
});

export const UpdateMealSchema = CreateMealSchema.omit({ householdRecipeId: true })
  .partial()
  .refine((meal) => Object.keys(meal).length > 0, {
    message: 'At least one field must be provided',
  });

export const MealResponseSchema = z.object({
  id: z.uuid(),
  householdRecipeId: z.uuid(),
  date: z.iso.date(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const FindMealsSchema = z
  .object({
    from: z.iso.date().optional(),
    to: z.iso.date().optional(),
  })
  .refine(({ from, to }) => !from || !to || from <= to, {
    message: 'from must be on or before to',
    path: ['from'],
  });

export const ShoppingListItemSchema = z.object({
  ingredientId: z.uuid(),
  name: z.string(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
});

export type CreateMealDto = z.infer<typeof CreateMealSchema>;
export type UpdateMealDto = z.infer<typeof UpdateMealSchema>;
export type MealResponseDto = z.infer<typeof MealResponseSchema>;
export type FindMealsDto = z.infer<typeof FindMealsSchema>;
export type ShoppingListItemDto = z.infer<typeof ShoppingListItemSchema>;
