import { ListEventsUseCase } from '../../../../application/use-cases/events/list-events.use-case.js';
import { MongoEventRepository } from '../../../../infrastructure/db/repositories/mongo-event.repository.js';

const eventRepository = new MongoEventRepository();
const listEventsUseCase = new ListEventsUseCase({ eventRepository });

class ListEventsController {
  async handle() {
    const events = await listEventsUseCase.execute();
    return events.map(e => e.snapshot);
  }
}

export const listEventsController = new ListEventsController();
