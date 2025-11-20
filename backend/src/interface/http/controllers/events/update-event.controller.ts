import { Request } from 'express';
import { UpdateEventUseCase } from '../../../../application/use-cases/events/update-event.use-case.js';
import { MongoEventRepository } from '../../../../infrastructure/db/repositories/mongo-event.repository.js';

const eventRepository = new MongoEventRepository();
const updateEventUseCase = new UpdateEventUseCase({ eventRepository });

class UpdateEventController {
  async handle(req: Request) {
    const event = await updateEventUseCase.execute(req.params.id, req.body);
    return event.snapshot;
  }
}

export const updateEventController = new UpdateEventController();
