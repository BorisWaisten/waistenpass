import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['admin', 'organizer', 'attendee']).optional()
}).refine((data) => Object.values(data).some((value) => value !== undefined), {
  message: 'At least one field must be provided'
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
