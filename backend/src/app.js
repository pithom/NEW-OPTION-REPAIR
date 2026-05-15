import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { createHttpError } from './utils/httpError.js';
import { apiLimiter, publicFormLimiter } from './middleware/rateLimiters.js';
import authRoutes from './routes/authRoutes.js';
import contactMessageRoutes from './routes/contactMessageRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import repairRoutes from './routes/repairRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import technicianRoutes from './routes/technicianRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDistPath = path.resolve(currentDir, '../../frontend/dist');
const frontendBuildExists = fs.existsSync(frontendDistPath);

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

const sharedHostingBaseDomains = new Set(['onrender.com', 'vercel.app', 'netlify.app', 'github.io']);

const getSiteInfo = (value) => {
  try {
    const { protocol, hostname } = new URL(value);
    const host = hostname.toLowerCase();

    if (host === 'localhost' || /^[\d.]+$/.test(host) || host.includes(':')) {
      return {
        baseDomain: host,
        siteKey: `${protocol}//${host}`
      };
    }

    const segments = host.split('.').filter(Boolean);
    const baseDomain =
      segments.length > 1 ? segments.slice(-2).join('.') : segments[0] || host;

    return {
      baseDomain,
      siteKey: `${protocol}//${baseDomain}`
    };
  } catch {
    return null;
  }
};

const isLikelySameSite = (originA, originB) => {
  const siteA = getSiteInfo(originA);
  const siteB = getSiteInfo(originB);

  if (!siteA || !siteB) {
    return false;
  }

  if (siteA.baseDomain !== siteB.baseDomain) {
    return false;
  }

  if (sharedHostingBaseDomains.has(siteA.baseDomain)) {
    return false;
  }

  return siteA.siteKey === siteB.siteKey;
};

const corsOptionsDelegate = (req, callback) => {
  const requestOrigin = normalizeOrigin(req.header('origin'));
  const requestHost = req.get('host');
  const requestServerOrigin = requestHost ? `${req.protocol}://${requestHost}` : '';
  const sameOrigin = Boolean(requestOrigin) && requestOrigin === requestServerOrigin;
  const sameSite = Boolean(requestOrigin) && isLikelySameSite(requestOrigin, requestServerOrigin);

  if (!requestOrigin || sameOrigin || sameSite || env.allowedOrigins.includes(requestOrigin)) {
    callback(null, {
      credentials: true,
      origin: requestOrigin || false
    });
    return;
  }

  callback(
    createHttpError(
      403,
      `This origin is not allowed to access the API: ${
        requestOrigin || 'unknown'
      }. Set FRONTEND_URL or ALLOWED_ORIGINS.`
    )
  );
};

app.disable('x-powered-by');
app.set('trust proxy', env.trustedProxyHops);

app.use(helmet());
app.use(cors(corsOptionsDelegate));
app.options('*', cors(corsOptionsDelegate));
app.use(cookieParser());
app.use(express.json({ limit: env.requestBodyLimit }));
app.use(express.urlencoded({ extended: false, limit: env.requestBodyLimit }));
app.use(apiLimiter);
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

app.get('/api/health', (req, res) => {
  res.json({ message: 'NEW OPTION TECHNOLOGY API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/contact-messages', contactMessageRoutes);
app.use('/api/public', publicFormLimiter, publicRoutes);

if (env.isProduction && frontendBuildExists) {
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) {
      next();
      return;
    }

    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
