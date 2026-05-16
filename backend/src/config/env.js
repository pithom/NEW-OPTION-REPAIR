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

const parseBooleanOrValue = (value, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return fallback;
};

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseSameSite = (value, fallback) => {
  const normalized = (value || '').trim().toLowerCase();

  if (normalized === 'strict' || normalized === 'lax' || normalized === 'none') {
    return normalized;
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
const frontendUrl = process.env.FRONTEND_URL?.trim() || '';
const frontendOrigin = normalizeOrigin(frontendUrl);
const hostedFrontendFallbackOrigins = ['https://new-option-repair.onrender.com'];
const allowedOrigins = Array.from(
  new Set([
    ...configuredAllowedOrigins,
    ...(nodeEnv === 'production' ? hostedFrontendFallbackOrigins : []),
    ...(frontendOrigin ? [frontendOrigin] : []),
    ...(nodeEnv === 'production' && renderExternalOrigin ? [renderExternalOrigin] : [])
  ])
);

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/new-optional-technology',
  renderExternalUrl,
  frontendUrl,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  allowedOrigins,
  authCookieName: process.env.AUTH_COOKIE_NAME || 'new_option_session',
  authCookieSameSite: parseSameSite(
    process.env.AUTH_COOKIE_SAME_SITE,
    nodeEnv === 'production' ? 'none' : 'lax'
  ),
  authCookieMaxAgeDays: parsePositiveInt(process.env.AUTH_COOKIE_MAX_AGE_DAYS, 7),
  requestBodyLimit: process.env.REQUEST_BODY_LIMIT || '200kb',
  trustedProxyHops: parsePositiveInt(process.env.TRUST_PROXY_HOPS, 1),
  admin: {
    name: process.env.ADMIN_NAME || 'System Administrator',
    email: process.env.ADMIN_EMAIL || 'admin@newoptiontechnology.com',
    password: adminPassword,
    phone: process.env.ADMIN_PHONE || '+250788790756'
  }
};

const usingWeakSecret = jwtSecret === 'change-me-in-production' || jwtSecret.length < 32;
const usingLocalMongoUri = /mongodb:\/\/(?:127\.0\.0\.1|localhost)/i.test(env.mongoUri);

if (env.isProduction) {
  const productionErrors = [];

  if (usingWeakSecret) {
    productionErrors.push('JWT_SECRET must be at least 32 characters.');
  }

  if (usingLocalMongoUri) {
    productionErrors.push('MONGODB_URI must point to hosted MongoDB, not localhost.');
  }

  if (adminPassword === 'Admin@12345') {
    productionErrors.push('ADMIN_PASSWORD must be changed from the default value.');
  }

  if (productionErrors.length > 0) {
    throw new Error(`Production environment is not ready: ${productionErrors.join(' ')}`);
  }
}
