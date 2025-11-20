import { Request } from 'express';
import { DeleteTicketUseCase } from '../../../../application/use-cases/tickets/delete-ticket.use-case.js';
import { MongoTicketRepository } from '../../../../infrastructure/db/repositories/mongo-ticket.repository.js';

const ticketRepository = new MongoTicketRepository();
const deleteTicketUseCase = new DeleteTicketUseCase({ ticketRepository });

class DeleteTicketController {
  async handle(req: Request) {
    const ticket = await deleteTicketUseCase.execute(req.params.id);
    return ticket.snapshot;
  }
}

export const deleteTicketController = new DeleteTicketController();
