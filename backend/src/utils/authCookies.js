import { env } from '../config/env.js';

const baseCookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: env.authCookieSameSite,
  secure: env.isProduction ? true : false
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
