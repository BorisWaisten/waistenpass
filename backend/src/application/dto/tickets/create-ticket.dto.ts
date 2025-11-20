import { z } from 'zod';

export const createTicketSchema = z.object({
  eventId: z.string().min(1),
  price: z.number().positive(),
  currency: z.string().length(3),
  quantity: z.number().int().positive().default(1)
});

export type CreateTicketDto = z.infer<typeof createTicketSchema> & { userId: string };
