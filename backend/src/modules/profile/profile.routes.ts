import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import * as controller from './profile.controller';
import { updateNameSchema, updatePasswordSchema } from './profile.schemas';

export const profileRouter = Router();

profileRouter.use(requireAuth);
profileRouter.get('/', controller.getProfile);
profileRouter.patch('/name', validateBody(updateNameSchema), controller.updateName);
profileRouter.patch('/password', validateBody(updatePasswordSchema), controller.updatePassword);
