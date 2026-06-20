import { Router } from 'express';
import { authRateLimiter } from '../../middleware/rateLimit';
import { validateBody } from '../../middleware/validate';
import * as controller from './auth.controller';
import { forgotSchema, loginSchema, mfaSchema, registerSchema, resetPasswordSchema } from './auth.schemas';

export const authRouter = Router();

authRouter.post('/register', authRateLimiter, validateBody(registerSchema), controller.register);
authRouter.post('/login', authRateLimiter, validateBody(loginSchema), controller.login);
authRouter.post('/login/2fa', authRateLimiter, validateBody(mfaSchema), controller.loginMfa);
authRouter.post('/refresh', controller.refresh);
authRouter.post('/logout', controller.logout);
authRouter.post('/forgot', authRateLimiter, validateBody(forgotSchema), controller.forgotPassword);
authRouter.post('/reset-password', authRateLimiter, validateBody(resetPasswordSchema), controller.resetPassword);
