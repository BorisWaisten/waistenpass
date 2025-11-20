import { Request } from 'express';
import { GetTicketByIdUseCase } from '../../../../application/use-cases/tickets/get-ticket-by-id.use-case.js';
import { MongoTicketRepository } from '../../../../infrastructure/db/repositories/mongo-ticket.repository.js';

const ticketRepository = new MongoTicketRepository();
const getTicketByIdUseCase = new GetTicketByIdUseCase({ ticketRepository });

class GetTicketByIdController {
  async handle(req: Request) {
    const ticket = await getTicketByIdUseCase.execute(req.params.id);
    return ticket.snapshot;
  }
}

export const getTicketByIdController = new GetTicketByIdController();
