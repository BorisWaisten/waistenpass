export type TicketStatus = 'pending' | 'confirmed' | 'cancelled' | 'validated';

export interface TicketProps {
  id: string;
  eventId: string;
  userId: string;
  price: number;
  currency: string;
  status: TicketStatus;
  issuedAt: Date;
  validatedAt?: Date;
}

export class Ticket {
  private constructor(private props: TicketProps) {}

  static create(props: TicketProps): Ticket {
    return new Ticket(props);
  }

  updateStatus(status: TicketStatus): void {
    this.props.status = status;
    if (status === 'validated' && !this.props.validatedAt) {
      this.props.validatedAt = new Date();
    }
  }

  updatePrice(price: number, currency: string): void {
    this.props.price = price;
    this.props.currency = currency;
  }

  get snapshot(): TicketProps {
    return { ...this.props };
  }
}
