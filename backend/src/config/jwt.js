import crypto from 'crypto';

export const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
export const JWT_EXPIRES_IN = '15m';
