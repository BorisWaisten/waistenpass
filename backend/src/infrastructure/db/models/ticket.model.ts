import { Schema, model } from 'mongoose';
import { TicketStatus } from '../../../domain/entities/ticket.js';

const ticketSchema = new Schema({
  _id: { type: String, required: true },
  eventId: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'validated'], default: 'pending' satisfies TicketStatus },
  issuedAt: { type: Date, default: Date.now },
  validatedAt: { type: Date }
}, { timestamps: true });

export const TicketModel = model('Ticket', ticketSchema);
