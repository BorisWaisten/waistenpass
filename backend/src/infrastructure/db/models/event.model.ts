import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  capacity: { type: Number, required: true, min: 1 },
  sold: { type: Number, default: 0, min: 0 },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true },
  categories: { type: [String], default: [] },
  organizerId: { type: String, required: true }
}, { timestamps: true, _id: false });

export const EventModel = model('Event', eventSchema);
