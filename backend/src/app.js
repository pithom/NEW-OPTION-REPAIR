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

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || env.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(createHttpError(403, 'This origin is not allowed to access the API.'));
  }
};

app.disable('x-powered-by');
app.set('trust proxy', env.trustedProxyHops);

app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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

app.use(notFound);
app.use(errorHandler);

export default app;
