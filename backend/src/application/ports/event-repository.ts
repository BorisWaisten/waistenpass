import { Event } from '../../domain/entities/event.js';

export interface EventRepository {
  save(event: Event): Promise<void>;
  findById(id: string): Promise<Event | null>;
  findAll(): Promise<Event[]>;
  delete(id: string): Promise<void>;
}
