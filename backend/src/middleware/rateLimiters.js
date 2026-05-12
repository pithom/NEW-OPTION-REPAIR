import rateLimit from 'express-rate-limit';

const buildLimiter = (options) =>
  rateLimit({
    legacyHeaders: false,
    standardHeaders: 'draft-7',
    message: {
      message: options.message
    },
    ...options
  });

export const apiLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many API requests. Please try again in a few minutes.'
});

export const authLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts. Please wait before trying again.'
});

export const forgotPasswordLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password reset requests. Please wait before trying again.'
});

export const verifyOtpLimiter = buildLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: 'Too many verification attempts. Please wait before trying again.'
});

export const resetPasswordLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password reset attempts. Please wait before trying again.'
});

export const publicFormLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: 'Too many contact submissions. Please wait before sending another message.'
});
