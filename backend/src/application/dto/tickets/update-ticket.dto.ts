import { z } from 'zod';
import { TicketStatus } from '../../../domain/entities/ticket.js';

export const updateTicketSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'validated'] as [TicketStatus, ...TicketStatus[]]).optional(),
  price: z.number().positive().optional(),
  currency: z.string().length(3).optional()
}).refine((data) => {
  if (data.price !== undefined && data.currency === undefined) {
    return false;
  }
  if (data.currency !== undefined && data.price === undefined) {
    return false;
  }
  return true;
}, {
  message: 'price and currency must be provided together'
}).refine((data) => Object.values(data).some((value) => value !== undefined), {
  message: 'At least one field must be provided'
});

export type UpdateTicketDto = z.infer<typeof updateTicketSchema>;
