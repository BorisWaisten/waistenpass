import { Router } from 'express';
import { validateRequest } from '../middlewares/validate-request.js';
import { loginSchema } from '../../../application/dto/auth/login.dto.js';
import { loginController } from '../controllers/auth/login.controller.js';

export const authRouter = Router();

authRouter.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    const result = await loginController.handle(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
