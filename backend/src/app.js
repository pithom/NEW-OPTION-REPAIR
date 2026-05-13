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

const corsOptionsDelegate = (req, callback) => {
  const requestOrigin = req.header('origin');
  const requestHost = req.get('host');
  const sameOrigin =
    Boolean(requestOrigin) && Boolean(requestHost) && requestOrigin === `${req.protocol}://${requestHost}`;

  if (!requestOrigin || sameOrigin || env.allowedOrigins.includes(requestOrigin)) {
    callback(null, {
      credentials: true,
      origin: requestOrigin || false
    });
    return;
  }

  callback(createHttpError(403, 'This origin is not allowed to access the API.'));
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
