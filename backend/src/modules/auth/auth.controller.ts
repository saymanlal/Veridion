import type { Request, Response } from 'express';
import { env } from '../../config/env';
import { extractDeviceMeta } from '../../utils/deviceMeta';
import { asyncHandler } from '../../utils/asyncHandler';
import * as authService from './auth.service';

const REFRESH_COOKIE_NAME = 'vrd_refresh';

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/auth',
    maxAge: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body, extractDeviceMeta(req));
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json({ user: result.user, accessToken: result.accessToken, message: 'Account created' });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body, extractDeviceMeta(req));

  if (result.requiresMfa) {
    return res.json({ requiresMfa: true, tempToken: result.tempToken });
  }

  setRefreshCookie(res, result.refreshToken);
  res.json({ requiresMfa: false, user: result.user, accessToken: result.accessToken, message: 'Logged in' });
});

export const loginMfa = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifyLoginMfa(req.body, extractDeviceMeta(req));
  setRefreshCookie(res, result.refreshToken);
  res.json({ user: result.user, accessToken: result.accessToken, message: 'Logged in' });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: 'No active session' });
  }
  const result = await authService.refreshSession(token);
  setRefreshCookie(res, result.refreshToken);
  res.json({ user: result.user, accessToken: result.accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  await authService.logoutSession(token);
  clearRefreshCookie(res);
  res.json({ message: 'Logged out' });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.requestPasswordReset(req.body);
  res.json(result);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req.body);
  res.json(result);
});
