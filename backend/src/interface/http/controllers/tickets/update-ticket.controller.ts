import { Request } from 'express';
import { UpdateTicketUseCase } from '../../../../application/use-cases/tickets/update-ticket.use-case.js';
import { MongoTicketRepository } from '../../../../infrastructure/db/repositories/mongo-ticket.repository.js';

const ticketRepository = new MongoTicketRepository();
const updateTicketUseCase = new UpdateTicketUseCase({ ticketRepository });

class UpdateTicketController {
  async handle(req: Request) {
    const ticket = await updateTicketUseCase.execute(req.params.id, req.body);
    return ticket.snapshot;
  }
}

export const updateTicketController = new UpdateTicketController();
