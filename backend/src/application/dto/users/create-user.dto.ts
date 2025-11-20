import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'organizer', 'attendee']).default('attendee')
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
