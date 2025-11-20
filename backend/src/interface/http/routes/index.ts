import { Router } from 'express';
import { ticketRouter } from './ticket.routes.js';
import { userRouter } from './user.routes.js';
import { eventRouter } from './event.routes.js';
import { authRouter } from './auth.routes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/tickets', ticketRouter);
router.use('/users', userRouter);
router.use('/events', eventRouter);
