import z from 'zod';
import { UserResponseSchema } from '../users/create.user.schema.js';

export const SignInResponseSchema = z.object({
  accessToken: z.string(),
  user: UserResponseSchema,
});

export type SignInResponseDto = z.infer<typeof SignInResponseSchema>;
