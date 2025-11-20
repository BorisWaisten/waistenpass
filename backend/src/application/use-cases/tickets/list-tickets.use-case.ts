import { Ticket } from '../../../domain/entities/ticket.js';
import { TicketRepository } from '../../ports/ticket-repository.js';

interface Dependencies {
  ticketRepository: TicketRepository;
  userId?: string;
  eventId?: string;
}

export class ListTicketsUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(): Promise<Ticket[]> {
    if (this.deps.userId) {
      return this.deps.ticketRepository.findByUserId(this.deps.userId);
    }
    if (this.deps.eventId) {
      return this.deps.ticketRepository.findByEventId(this.deps.eventId);
    }
    return this.deps.ticketRepository.findAll();
  }
}
