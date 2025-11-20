import { z } from 'zod';

export const createEventSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  capacity: z.number().int().positive(),
  price: z.number().positive(),
  currency: z.string().length(3).default('ARS'),
  categories: z.array(z.string()).default([]),
  organizerId: z.string().uuid()
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: 'endDate must be after startDate'
});

export type CreateEventDto = z.infer<typeof createEventSchema>;
