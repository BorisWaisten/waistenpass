import { Router } from 'express';
import { validateRequest } from '../middlewares/validate-request.js';
import { validateParam } from '../middlewares/validate-param.js';
import { authenticate, authorize, AuthRequest } from '../middlewares/auth.middleware.js';
import { createEventSchema } from '../../../application/dto/events/create-event.dto.js';
import { updateEventSchema } from '../../../application/dto/events/update-event.dto.js';
import { createEventController } from '../controllers/events/create-event.controller.js';
import { updateEventController } from '../controllers/events/update-event.controller.js';
import { deleteEventController } from '../controllers/events/delete-event.controller.js';
import { listEventsController } from '../controllers/events/list-events.controller.js';
import { getEventByIdController } from '../controllers/events/get-event-by-id.controller.js';

export const eventRouter = Router();

// GET endpoints son públicos (cualquiera puede ver eventos)
eventRouter.get('/', async (_req, res, next) => {
  try {
    const result = await listEventsController.handle();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

eventRouter.get('/:id', validateParam('id'), async (req, res, next) => {
  try {
    const result = await getEventByIdController.handle(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// POST: admin puede crear eventos para cualquier organizador, organizer solo para sí mismo
eventRouter.post('/', authenticate, authorize('admin', 'organizer'), validateRequest(createEventSchema), async (req: AuthRequest, res, next) => {
  try {
    const result = await createEventController.handle(req);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

eventRouter.put('/:id', authenticate, authorize('admin'), validateParam('id'), validateRequest(updateEventSchema), async (req, res, next) => {
  try {
    const result = await updateEventController.handle(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

eventRouter.delete('/:id', authenticate, authorize('admin'), validateParam('id'), async (req, res, next) => {
  try {
    const result = await deleteEventController.handle(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
