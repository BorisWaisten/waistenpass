import { Event } from '../../../domain/entities/event.js';
import { EventRepository } from '../../ports/event-repository.js';
import { NotFoundError } from '../../../domain/errors/not-found.error.js';

interface Dependencies {
  eventRepository: EventRepository;
}

export class DeleteEventUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(id: string): Promise<Event> {
    const event = await this.deps.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    await this.deps.eventRepository.delete(id);
    return event;
  }
}
