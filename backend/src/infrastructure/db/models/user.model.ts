import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  _id: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'organizer', 'attendee'], default: 'attendee' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const UserModel = model('User', userSchema);
