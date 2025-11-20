import { randomUUID } from 'node:crypto';
import { Event } from '../../../domain/entities/event.js';
import { CreateEventDto } from '../../dto/events/create-event.dto.js';
import { EventRepository } from '../../ports/event-repository.js';

interface Dependencies {
  eventRepository: EventRepository;
  idGenerator?: () => string;
  now?: () => Date;
}

export class CreateEventUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(input: CreateEventDto): Promise<Event> {
    const event = Event.create({
      id: (this.deps.idGenerator ?? randomUUID)(),
      name: input.name,
      description: input.description,
      location: input.location,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      capacity: input.capacity,
      sold: 0,
      categories: input.categories ?? [],
      organizerId: input.organizerId,
      price: input.price,
      currency: input.currency ?? 'ARS'
    });

    await this.deps.eventRepository.save(event);
    return event;
  }
}
