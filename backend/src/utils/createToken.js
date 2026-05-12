import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const createToken = (userId) =>
  jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
