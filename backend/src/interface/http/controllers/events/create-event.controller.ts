import { AuthRequest } from '../middlewares/auth.middleware.js';
import { CreateEventUseCase } from '../../../../application/use-cases/events/create-event.use-case.js';
import { MongoEventRepository } from '../../../../infrastructure/db/repositories/mongo-event.repository.js';
import { DomainError } from '../../../../domain/errors/domain-error.js';

const eventRepository = new MongoEventRepository();
const createEventUseCase = new CreateEventUseCase({ eventRepository });

class CreateEventController {
  async handle(req: AuthRequest) {
    // Si el usuario es organizer, solo puede crear eventos para sí mismo
    if (req.user?.role === 'organizer' && req.body.organizerId !== req.user.id) {
      throw new DomainError('Los organizadores solo pueden crear eventos para sí mismos');
    }

    // Si el usuario es admin, puede crear eventos para cualquier organizador
    // Si no hay usuario (no debería pasar por el middleware), rechazar
    if (!req.user) {
      throw new DomainError('Usuario no autenticado');
    }

    const event = await createEventUseCase.execute(req.body);
    return event.snapshot;
  }
}

export const createEventController = new CreateEventController();
