import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const bearerToken = authorization.startsWith('Bearer ')
    ? authorization.split(' ')[1]
    : null;
  const cookieToken = req.cookies?.[env.authCookieName] || null;
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User account not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
