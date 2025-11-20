import { Ticket } from '../../../domain/entities/ticket.js';
import { UpdateTicketDto } from '../../dto/tickets/update-ticket.dto.js';
import { TicketRepository } from '../../ports/ticket-repository.js';
import { NotFoundError } from '../../../domain/errors/not-found.error.js';

interface Dependencies {
  ticketRepository: TicketRepository;
}

export class UpdateTicketUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(id: string, input: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.deps.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    const snapshot = ticket.snapshot;

    if (input.status) {
      snapshot.status = input.status;
      if (input.status === 'validated' && !snapshot.validatedAt) {
        snapshot.validatedAt = new Date();
      }
    }

    if (input.price !== undefined && input.currency) {
      snapshot.price = input.price;
      snapshot.currency = input.currency;
    }

    const updated = Ticket.create(snapshot);
    await this.deps.ticketRepository.save(updated);
    return updated;
  }
}
