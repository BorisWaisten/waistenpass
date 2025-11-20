import { User } from '../../../domain/entities/user.js';
import { UserRepository } from '../../../application/ports/user-repository.js';
import { UserModel } from '../models/user.model.js';

type UserDocument = {
  _id: {
    toString(): string;
  };
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
};

const hydrate = (doc: UserDocument): User =>
  User.create({
    id: doc._id.toString(),
    email: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.role as User['snapshot']['role'],
    createdAt: doc.createdAt
  });

export class MongoUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    return doc ? hydrate(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({ _id: id }).lean();
    return doc ? hydrate(doc) : null;
  }

  async save(user: User): Promise<void> {
    const snapshot = user.snapshotWithSensitiveData();
    await UserModel.findOneAndUpdate(
      { _id: snapshot.id },
      { ...snapshot, _id: snapshot.id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find().lean();
    return docs.map(hydrate);
  }

  async delete(id: string): Promise<void> {
    await UserModel.deleteOne({ _id: id });
  }
}
