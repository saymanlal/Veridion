import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

const accessTokenTtl = env.JWT_ACCESS_TTL as SignOptions['expiresIn'];

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface RefreshTokenPayload {
  sub: string;
  deviceId: string;
  jti: string;
}

export interface MfaTokenPayload {
  sub: string;
  purpose: 'mfa-challenge';
}

export const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: accessTokenTtl });

export const signRefreshToken = (payload: RefreshTokenPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 });

export const signMfaToken = (payload: MfaTokenPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '5m' });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;

export const verifyMfaToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as MfaTokenPayload;
