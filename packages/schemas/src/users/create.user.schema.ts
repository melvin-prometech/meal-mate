import { z } from 'zod';
import { UserRole } from './user-role.enum.js';

export const CreateUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(UserRole),
});

export const UserResponseSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  role: z.enum(UserRole)
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export type UserResponseDto = z.infer<typeof UserResponseSchema>;