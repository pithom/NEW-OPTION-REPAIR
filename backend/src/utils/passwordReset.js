import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const generatePasswordResetOtp = () => crypto.randomInt(100000, 1000000).toString();

export const hashPasswordResetOtp = (otp) => bcrypt.hash(otp, 10);

export const comparePasswordResetOtp = (otp, hash) => bcrypt.compare(otp, hash);

export const generatePasswordResetSessionToken = () => crypto.randomBytes(32).toString('hex');

export const hashPasswordResetSessionToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const comparePasswordResetSessionToken = (token, storedHash) => {
  if (!token || !storedHash) {
    return false;
  }

  const currentHashBuffer = Buffer.from(hashPasswordResetSessionToken(token), 'hex');
  const storedHashBuffer = Buffer.from(storedHash, 'hex');

  if (currentHashBuffer.length !== storedHashBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(currentHashBuffer, storedHashBuffer);
};

export const createExpiryFromNow = (minutes) => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
  return expiresAt;
};
