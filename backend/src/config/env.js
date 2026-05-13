import dotenv from 'dotenv';

dotenv.config();

const parseList = (value, fallback = []) => {
  if (!value) {
    return fallback;
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseBoolean = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  if (String(value).toLowerCase() === 'true') {
    return true;
  }

  if (String(value).toLowerCase() === 'false') {
    return false;
  }

  return fallback;
};

const normalizeOrigin = (value) => {
  if (!value) {
    return '';
  }

  try {
    return new URL(value).origin;
  } catch {
    return value.trim().replace(/\/+$/, '');
  }
};

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET?.trim() || 'change-me-in-production';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
const localAllowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const configuredAllowedOrigins = parseList(
  process.env.ALLOWED_ORIGINS,
  nodeEnv === 'production' ? [] : localAllowedOrigins
).map(normalizeOrigin);
const renderExternalUrl = process.env.RENDER_EXTERNAL_URL?.trim() || '';
const renderExternalOrigin = normalizeOrigin(renderExternalUrl);
const allowedOrigins = Array.from(
  new Set([
    ...configuredAllowedOrigins,
    ...(nodeEnv === 'production' && renderExternalOrigin ? [renderExternalOrigin] : [])
  ])
);

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/new-optional-technology',
  renderExternalUrl,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  allowedOrigins,
  authCookieName: process.env.AUTH_COOKIE_NAME || 'new_option_session',
  authCookieMaxAgeDays: parsePositiveInt(process.env.AUTH_COOKIE_MAX_AGE_DAYS, 7),
  passwordResetCookieName: process.env.PASSWORD_RESET_COOKIE_NAME || 'new_option_password_reset',
  passwordResetOtpExpiresMinutes: parsePositiveInt(process.env.PASSWORD_RESET_OTP_EXPIRES_MINUTES, 5),
  passwordResetSessionExpiresMinutes: parsePositiveInt(process.env.PASSWORD_RESET_SESSION_EXPIRES_MINUTES, 10),
  passwordResetMaxAttempts: parsePositiveInt(process.env.PASSWORD_RESET_MAX_ATTEMPTS, 5),
  passwordResetResendCooldownSeconds: parsePositiveInt(process.env.PASSWORD_RESET_RESEND_COOLDOWN_SECONDS, 60),
  requestBodyLimit: process.env.REQUEST_BODY_LIMIT || '200kb',
  trustedProxyHops: parsePositiveInt(process.env.TRUST_PROXY_HOPS, 1),
  smtp: {
    service: process.env.SMTP_SERVICE?.trim() || '',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parsePositiveInt(process.env.SMTP_PORT, 465),
    secure: parseBoolean(process.env.SMTP_SECURE, true),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || '',
    fromName: process.env.SMTP_FROM_NAME || 'NEW OPTION TECHNOLOGY'
  },
  admin: {
    name: process.env.ADMIN_NAME || 'System Administrator',
    email: process.env.ADMIN_EMAIL || 'admin@newoptiontechnology.com',
    password: adminPassword,
    phone: process.env.ADMIN_PHONE || '+250788790756'
  }
};

const usingWeakSecret = jwtSecret === 'change-me-in-production' || jwtSecret.length < 32;
const smtpConfigured = Boolean(env.smtp.user && env.smtp.pass && (env.smtp.service || env.smtp.host));
const usingLocalMongoUri = /mongodb:\/\/(?:127\.0\.0\.1|localhost)/i.test(env.mongoUri);

if (env.isProduction && usingWeakSecret) {
  throw new Error('JWT_SECRET must be set to a strong value with at least 32 characters in production.');
}

if (env.isProduction && usingLocalMongoUri) {
  throw new Error(
    'MONGODB_URI must point to a hosted MongoDB deployment in production instead of localhost.'
  );
}

if (env.isProduction && adminPassword === 'Admin@12345') {
  throw new Error('ADMIN_PASSWORD must be changed from the default value in production.');
}

if (env.isProduction && !smtpConfigured) {
  throw new Error('SMTP email credentials must be configured in production.');
}
