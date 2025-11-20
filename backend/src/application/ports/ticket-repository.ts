import { Ticket, TicketProps } from '../../domain/entities/ticket.js';

export interface TicketRepository {
  save(ticket: Ticket): Promise<void>;
  findById(id: string): Promise<Ticket | null>;
  findAll(): Promise<Ticket[]>;
  findByUserId(userId: string): Promise<Ticket[]>;
  findByEventId(eventId: string): Promise<Ticket[]>;
  delete(id: string): Promise<void>;
}

export const ticketFromPersistence = (data: TicketProps): Ticket => Ticket.create(data);
