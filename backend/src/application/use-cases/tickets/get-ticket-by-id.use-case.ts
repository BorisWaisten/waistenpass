import { Ticket } from '../../../domain/entities/ticket.js';
import { TicketRepository } from '../../ports/ticket-repository.js';
import { NotFoundError } from '../../../domain/errors/not-found.error.js';

interface Dependencies {
  ticketRepository: TicketRepository;
}

export class GetTicketByIdUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(id: string): Promise<Ticket> {
    const ticket = await this.deps.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }
    return ticket;
  }
}
