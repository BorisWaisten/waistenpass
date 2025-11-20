import { Request } from 'express';
import { GetEventByIdUseCase } from '../../../../application/use-cases/events/get-event-by-id.use-case.js';
import { MongoEventRepository } from '../../../../infrastructure/db/repositories/mongo-event.repository.js';

const eventRepository = new MongoEventRepository();
const getEventByIdUseCase = new GetEventByIdUseCase({ eventRepository });

class GetEventByIdController {
  async handle(req: Request) {
    const event = await getEventByIdUseCase.execute(req.params.id);
    return event.snapshot;
  }
}

export const getEventByIdController = new GetEventByIdController();
