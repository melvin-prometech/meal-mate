import { z } from 'zod';

export const FindUserSchema = z.object({
  id: z.string(),
});

export type FindUserDto =
  z.infer<typeof FindUserSchema>;
