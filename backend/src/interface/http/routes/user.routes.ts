import { Router } from 'express';
import { validateRequest } from '../middlewares/validate-request.js';
import { createUserSchema } from '../../../application/dto/users/create-user.dto.js';
import { createUserController } from '../controllers/users/create-user.controller.js';
import { updateUserController } from '../controllers/users/update-user.controller.js';
import { deleteUserController } from '../controllers/users/delete-user.controller.js';
import { listUsersController } from '../controllers/users/list-users.controller.js';
import { getUserByIdController } from '../controllers/users/get-user-by-id.controller.js';
import { updateUserSchema } from '../../../application/dto/users/update-user.dto.js';
import { validateParam } from '../middlewares/validate-param.js';

export const userRouter = Router();

userRouter.post('/', validateRequest(createUserSchema), async (req, res, next) => {
  try {
    const result = await createUserController.handle(req);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/', async (_req, res, next) => {
  try {
    const result = await listUsersController.handle();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/:id', validateParam('id'), async (req, res, next) => {
  try {
    const result = await getUserByIdController.handle(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.put('/:id', validateParam('id'), validateRequest(updateUserSchema), async (req, res, next) => {
  try {
    const result = await updateUserController.handle(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.delete('/:id', validateParam('id'), async (req, res, next) => {
  try {
    const result = await deleteUserController.handle(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});