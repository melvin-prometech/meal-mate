import { z } from 'zod';

export const CreateHouseholdSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
});

export type CreateHouseholdDto = z.infer<typeof CreateHouseholdSchema>;