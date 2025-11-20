import { z } from 'zod';

export const updateEventSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  capacity: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  categories: z.array(z.string()).optional()
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) < new Date(data.endDate);
  }
  return true;
}, {
  message: 'endDate must be after startDate'
}).refine((data) => Object.values(data).some((value) => value !== undefined), {
  message: 'At least one field must be provided'
});

export type UpdateEventDto = z.infer<typeof updateEventSchema>;
