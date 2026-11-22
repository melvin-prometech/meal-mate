import { z } from 'zod';

export const SignUpSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export type SignUpDto = z.infer<typeof SignUpSchema>;
