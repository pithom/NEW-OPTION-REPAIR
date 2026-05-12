import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async () => {
  mongoose.set('strictQuery', true);
  mongoose.set('sanitizeFilter', true);
  await mongoose.connect(env.mongoUri);
};
