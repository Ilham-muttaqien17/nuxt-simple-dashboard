import { z } from 'zod';

export const LoginForm = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6, 'Password must be at least 6 character')
});

export type TLoginForm = z.infer<typeof LoginForm>;
