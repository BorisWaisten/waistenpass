import { Ticket } from '../../../domain/entities/ticket.js';
import { TicketRepository, ticketFromPersistence } from '../../../application/ports/ticket-repository.js';
import { TicketModel } from '../models/ticket.model.js';

export class MongoTicketRepository implements TicketRepository {
  async save(ticket: Ticket): Promise<void> {
    const snapshot = ticket.snapshot;
    await TicketModel.findOneAndUpdate(
      { _id: snapshot.id },
      { ...snapshot, _id: snapshot.id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  async findById(id: string): Promise<Ticket | null> {
    const doc = await TicketModel.findOne({ _id: id }).lean();
    return doc ? ticketFromPersistence({
      id: doc._id.toString(),
      eventId: doc.eventId,
      userId: doc.userId,
      price: doc.price,
      currency: doc.currency,
      status: doc.status,
      issuedAt: doc.issuedAt,
      validatedAt: doc.validatedAt ?? undefined
    }) : null;
  }

  async findAll(): Promise<Ticket[]> {
    const docs = await TicketModel.find().lean();
    return docs.map(doc => ticketFromPersistence({
      id: doc._id.toString(),
      eventId: doc.eventId,
      userId: doc.userId,
      price: doc.price,
      currency: doc.currency,
      status: doc.status,
      issuedAt: doc.issuedAt,
      validatedAt: doc.validatedAt ?? undefined
    }));
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    const docs = await TicketModel.find({ userId }).lean();
    return docs.map(doc => ticketFromPersistence({
      id: doc._id.toString(),
      eventId: doc.eventId,
      userId: doc.userId,
      price: doc.price,
      currency: doc.currency,
      status: doc.status,
      issuedAt: doc.issuedAt,
      validatedAt: doc.validatedAt ?? undefined
    }));
  }

  async findByEventId(eventId: string): Promise<Ticket[]> {
    const docs = await TicketModel.find({ eventId }).lean();
    return docs.map(doc => ticketFromPersistence({
      id: doc._id.toString(),
      eventId: doc.eventId,
      userId: doc.userId,
      price: doc.price,
      currency: doc.currency,
      status: doc.status,
      issuedAt: doc.issuedAt,
      validatedAt: doc.validatedAt ?? undefined
    }));
  }

  async delete(id: string): Promise<void> {
    await TicketModel.deleteOne({ _id: id });
  }
}
