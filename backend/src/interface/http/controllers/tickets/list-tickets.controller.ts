import { Request } from 'express';
import { ListTicketsUseCase } from '../../../../application/use-cases/tickets/list-tickets.use-case.js';
import { MongoTicketRepository } from '../../../../infrastructure/db/repositories/mongo-ticket.repository.js';

const ticketRepository = new MongoTicketRepository();

class ListTicketsController {
  async handle(req: Request) {
    const userId = req.query.userId as string | undefined;
    const eventId = req.query.eventId as string | undefined;
    
    const listTicketsUseCase = new ListTicketsUseCase({
      ticketRepository,
      userId,
      eventId
    });

    const tickets = await listTicketsUseCase.execute();
    return tickets.map(t => t.snapshot);
  }
}

export const listTicketsController = new ListTicketsController();
