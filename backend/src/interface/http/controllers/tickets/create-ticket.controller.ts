import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { randomUUID } from 'node:crypto';
import { CreateTicketUseCase } from '../../../../application/use-cases/tickets/create-ticket.use-case.js';
import { MongoTicketRepository } from '../../../../infrastructure/db/repositories/mongo-ticket.repository.js';
import { MongoEventRepository } from '../../../../infrastructure/db/repositories/mongo-event.repository.js';

const ticketRepository = new MongoTicketRepository();
const eventRepository = new MongoEventRepository();
const createTicketUseCase = new CreateTicketUseCase({
  ticketRepository,
  eventRepository,
  idGenerator: () => randomUUID(),
  now: () => new Date()
});

class CreateTicketController {
  async handle(req: AuthRequest) {
    if (!req.user?.id) {
      throw new Error('User not authenticated');
    }

    const tickets = await createTicketUseCase.execute({
      ...req.body,
      userId: req.user.id,
      currency: req.body.currency?.toUpperCase() ?? 'ARS',
      quantity: req.body.quantity ?? 1
    });

    // Retornar el array de tickets creados
    return {
      tickets: tickets.map(t => t.snapshot),
      total: tickets.length,
      totalPrice: tickets.reduce((sum, t) => sum + t.snapshot.price, 0)
    };
  }
}

export const createTicketController = new CreateTicketController();
