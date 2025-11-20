import { Ticket } from '../../../domain/entities/ticket.js';
import { CreateTicketDto } from '../../dto/tickets/create-ticket.dto.js';
import { TicketRepository } from '../../ports/ticket-repository.js';
import { EventRepository } from '../../ports/event-repository.js';
import { NotFoundError } from '../../../domain/errors/not-found.error.js';
import { DomainError } from '../../../domain/errors/domain-error.js';

interface Dependencies {
  ticketRepository: TicketRepository;
  eventRepository: EventRepository;
  idGenerator: () => string;
  now: () => Date;
}

export class CreateTicketUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(payload: CreateTicketDto): Promise<Ticket[]> {
    const event = await this.deps.eventRepository.findById(payload.eventId);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const snapshot = event.snapshot;
    const quantity = payload.quantity ?? 1;

    if (snapshot.sold + quantity > snapshot.capacity) {
      throw new DomainError(`No hay suficientes entradas disponibles. Disponibles: ${snapshot.capacity - snapshot.sold}, Solicitadas: ${quantity}`);
    }

    if (payload.currency.toUpperCase() !== snapshot.currency.toUpperCase()) {
      throw new DomainError('La moneda indicada no coincide con la del evento');
    }

    const tickets: Ticket[] = [];
    const now = this.deps.now();

    // Crear múltiples tickets
    for (let i = 0; i < quantity; i++) {
      const ticket = Ticket.create({
        id: this.deps.idGenerator(),
        eventId: payload.eventId,
        userId: payload.userId,
        price: payload.price,
        currency: payload.currency.toUpperCase(),
        status: 'pending',
        issuedAt: now
      });
      tickets.push(ticket);
      await this.deps.ticketRepository.save(ticket);
    }

    // Incrementar el contador de vendidos
    event.incrementSold(quantity);
    await this.deps.eventRepository.save(event);

    return tickets;
  }
}
