import type { Request } from 'express';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export interface DeviceMeta {
  name: string;
  location: string;
  ip: string;
}

function resolveClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress?.replace('::ffff:', '') ?? '0.0.0.0';
}

export function extractDeviceMeta(req: Request): DeviceMeta {
  const ip = resolveClientIp(req);
  const ua = new UAParser(req.headers['user-agent'] ?? '').getResult();

  const browser = ua.browser.name ?? 'Unknown Browser';
  const os = ua.os.name ?? 'Unknown OS';
  const name = `${browser} - ${os}`;

  const geo = geoip.lookup(ip);
  const location = geo ? `${geo.city || geo.region || 'Unknown'}, ${geo.country}` : 'Unknown location';

  return { name, location, ip };
}
