import { DomainError } from '../errors/domain-error.js';

export interface EventProps {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  sold: number;
  categories: string[];
  organizerId: string;
  price: number;
  currency: string;
}

export class Event {
  private constructor(private props: EventProps) {}

  static create(props: EventProps): Event {
    return new Event(props);
  }

  updateDetails(partial: Partial<Omit<EventProps, 'id' | 'sold' | 'organizerId'>>): void {
    this.props = { ...this.props, ...partial };
  }

  incrementSold(quantity = 1): void {
    if (this.props.sold + quantity > this.props.capacity) {
      throw new DomainError('No hay más cupos disponibles para este evento');
    }
    this.props.sold += quantity;
  }

  get snapshot(): EventProps {
    return { ...this.props };
  }
}
