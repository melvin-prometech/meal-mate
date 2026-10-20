import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
});

export const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});

export type CreateUserDto =
  z.infer<typeof CreateUserSchema>;

export type UserResponseDto =
  z.infer<typeof UserResponseSchema>;