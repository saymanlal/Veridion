import crypto from 'crypto';

const randomDigits = (length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

const randomHex = (length: number) => crypto.randomBytes(length).toString('hex');

export const generateUserUuid = () => `UID-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

export const generateTransactionId = () => {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `TX-${randomDigits(4)}${letter}`;
};

export const generateTicketId = () => `VRD-TKT-${randomDigits(4)}`;

export const generateDeviceId = (sequence: number) => `DEV-${String(sequence).padStart(2, '0')}`;

export const generateMockHash = () => `0x${randomHex(4)}...${randomHex(2)}`;

export const generateVerificationCode = () => `VRD-OK-${randomDigits(2)}`;
