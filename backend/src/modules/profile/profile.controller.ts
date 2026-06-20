import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as profileService from './profile.service';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await profileService.getProfile(req.user!.sub);
  res.json({ user });
});

export const updateName = asyncHandler(async (req: Request, res: Response) => {
  const user = await profileService.updateName(req.user!.sub, req.body);
  res.json({ user, message: 'Name updated' });
});

export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await profileService.updatePassword(req.user!.sub, req.body);
  res.json(result);
});
