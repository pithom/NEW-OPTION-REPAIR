import { env } from '../config/env.js';

const baseCookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: env.isProduction
};

const passwordResetCookieOptions = {
  httpOnly: true,
  path: '/api/auth',
  sameSite: 'strict',
  secure: env.isProduction
};

export const setAuthCookie = (res, token, remember = false) => {
  const options = { ...baseCookieOptions };

  if (remember) {
    options.maxAge = env.authCookieMaxAgeDays * 24 * 60 * 60 * 1000;
  }

  res.cookie(env.authCookieName, token, options);
};

export const clearAuthCookie = (res) => {
  res.clearCookie(env.authCookieName, baseCookieOptions);
};

export const setPasswordResetCookie = (res, token) => {
  res.cookie(env.passwordResetCookieName, token, {
    ...passwordResetCookieOptions,
    maxAge: env.passwordResetSessionExpiresMinutes * 60 * 1000
  });
};

export const clearPasswordResetCookie = (res) => {
  res.clearCookie(env.passwordResetCookieName, passwordResetCookieOptions);
};
