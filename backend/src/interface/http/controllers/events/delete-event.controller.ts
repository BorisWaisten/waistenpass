import { Request } from 'express';
import { DeleteEventUseCase } from '../../../../application/use-cases/events/delete-event.use-case.js';
import { MongoEventRepository } from '../../../../infrastructure/db/repositories/mongo-event.repository.js';

const eventRepository = new MongoEventRepository();
const deleteEventUseCase = new DeleteEventUseCase({ eventRepository });

class DeleteEventController {
  async handle(req: Request) {
    const event = await deleteEventUseCase.execute(req.params.id);
    return event.snapshot;
  }
}

export const deleteEventController = new DeleteEventController();
