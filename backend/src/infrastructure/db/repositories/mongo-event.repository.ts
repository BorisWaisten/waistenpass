import { Event } from '../../../domain/entities/event.js';
import { EventRepository } from '../../../application/ports/event-repository.js';
import { EventModel } from '../models/event.model.js';

type EventDocument = {
  _id: {
    toString(): string;
  };
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
};

const hydrate = (doc: EventDocument): Event =>
  Event.create({
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    location: doc.location,
    startDate: doc.startDate,
    endDate: doc.endDate,
    capacity: doc.capacity,
    sold: doc.sold,
    categories: doc.categories,
    organizerId: doc.organizerId,
    price: doc.price,
    currency: doc.currency
  });

export class MongoEventRepository implements EventRepository {
  async save(event: Event): Promise<void> {
    const snapshot = event.snapshot;
    await EventModel.findOneAndUpdate(
      { _id: snapshot.id },
      { ...snapshot, _id: snapshot.id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  async findById(id: string): Promise<Event | null> {
    const doc = await EventModel.findOne({ _id: id }).lean();
    return doc ? hydrate(doc) : null;
  }

  async findAll(): Promise<Event[]> {
    const docs = await EventModel.find().lean();
    return docs.map(hydrate);
  }

  async delete(id: string): Promise<void> {
    await EventModel.deleteOne({ _id: id });
  }
}
