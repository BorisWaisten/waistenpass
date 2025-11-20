import { Event } from '../../../domain/entities/event.js';
import { EventRepository } from '../../ports/event-repository.js';

interface Dependencies {
  eventRepository: EventRepository;
}

export class ListEventsUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(): Promise<Event[]> {
    return this.deps.eventRepository.findAll();
  }
}
