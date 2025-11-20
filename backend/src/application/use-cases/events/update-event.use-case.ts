import { Event } from '../../../domain/entities/event.js';
import { UpdateEventDto } from '../../dto/events/update-event.dto.js';
import { EventRepository } from '../../ports/event-repository.js';
import { NotFoundError } from '../../../domain/errors/not-found.error.js';

interface Dependencies {
  eventRepository: EventRepository;
}

export class UpdateEventUseCase {
  constructor(private readonly deps: Dependencies) {}

  async execute(id: string, input: UpdateEventDto): Promise<Event> {
    const event = await this.deps.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const snapshot = event.snapshot;

    if (input.name) snapshot.name = input.name;
    if (input.description) snapshot.description = input.description;
    if (input.location) snapshot.location = input.location;
    if (input.startDate) snapshot.startDate = new Date(input.startDate);
    if (input.endDate) snapshot.endDate = new Date(input.endDate);
    if (input.capacity !== undefined) snapshot.capacity = input.capacity;
    if (input.price !== undefined) snapshot.price = input.price;
    if (input.currency) snapshot.currency = input.currency.toUpperCase();
    if (input.categories) snapshot.categories = input.categories;

    const updated = Event.create(snapshot);
    await this.deps.eventRepository.save(updated);
    return updated;
  }
}
