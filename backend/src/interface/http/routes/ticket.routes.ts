import { Router } from 'express';
import { createTicketController } from '../controllers/tickets/create-ticket.controller.js';
import { updateTicketController } from '../controllers/tickets/update-ticket.controller.js';
import { listTicketsController } from '../controllers/tickets/list-tickets.controller.js';
import { getTicketByIdController } from '../controllers/tickets/get-ticket-by-id.controller.js';
import { deleteTicketController } from '../controllers/tickets/delete-ticket.controller.js';
import { validateRequest } from '../middlewares/validate-request.js';
import { validateParam } from '../middlewares/validate-param.js';
import { authenticate, authorize, AuthRequest } from '../middlewares/auth.middleware.js';
import { createTicketSchema } from '../../../application/dto/tickets/create-ticket.dto.js';
import { updateTicketSchema } from '../../../application/dto/tickets/update-ticket.dto.js';

export const ticketRouter = Router();

// Crear ticket requiere autenticación (cualquier usuario puede comprar)
ticketRouter.post('/', authenticate, validateRequest(createTicketSchema), async (req: AuthRequest, res, next) => {
  try {
    const result = await createTicketController.handle(req);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Listar tickets: usuarios solo ven los suyos, admin ve todos
ticketRouter.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    // Si no es admin, filtrar por userId del token
    if (req.user?.role !== 'admin' && !req.query.userId) {
      req.query.userId = req.user?.id;
    }
    const result = await listTicketsController.handle(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Ver ticket: usuarios solo pueden ver los suyos, admin puede ver cualquiera
ticketRouter.get('/:id', authenticate, validateParam('id'), async (req: AuthRequest, res, next) => {
  try {
    const result = await getTicketByIdController.handle(req);
    // Si no es admin, verificar que el ticket pertenezca al usuario
    if (req.user?.role !== 'admin' && result.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

ticketRouter.put('/:id', authenticate, authorize('admin'), validateParam('id'), validateRequest(updateTicketSchema), async (req: AuthRequest, res, next) => {
  try {
    const result = await updateTicketController.handle(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

ticketRouter.delete('/:id', authenticate, validateParam('id'), async (req: AuthRequest, res, next) => {
  try {
    const result = await deleteTicketController.handle(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
