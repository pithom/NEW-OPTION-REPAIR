import User from '../models/User.js';
import { clearAuthCookie, setAuthCookie } from '../utils/authCookies.js';
import { createToken } from '../utils/createToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createHttpError } from '../utils/httpError.js';
import { ensurePasswordStrength, normalizeEmail, normalizePhone, normalizeString } from '../utils/validation.js';

const readSecretInput = (value, field) => {
  if (typeof value !== 'string' || value.length === 0 || value.length > 256) {
    throw createHttpError(400, `${field} is required.`);
  }

  return value;
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role
});

export const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email, { required: true });
  const password = readSecretInput(req.body.password, 'Password');
  const remember = Boolean(req.body.remember);

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw createHttpError(401, 'Invalid email or password.');
  }

  const token = createToken(user._id);
  setAuthCookie(res, token, remember);

  res.json({
    user: sanitizeUser(user),
    token
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  const nextName = normalizeString(req.body.name, {
    field: 'Name',
    required: true,
    max: 120
  });
  const nextEmail = normalizeEmail(req.body.email, { required: true });
  const nextPhone = normalizePhone(req.body.phone, { field: 'Phone number' });

  const emailOwner = await User.findOne({ email: nextEmail });

  if (emailOwner && emailOwner._id.toString() !== req.user._id.toString()) {
    throw createHttpError(409, 'Another account is already using that email address.');
  }

  user.name = nextName;
  user.email = nextEmail;
  user.phone = nextPhone;

  await user.save();

  res.json({
    message: 'Profile updated successfully.',
    user: sanitizeUser(user)
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const currentPassword = readSecretInput(req.body.currentPassword, 'Current password');
  const newPassword = ensurePasswordStrength(req.body.newPassword, {
    field: 'New password'
  });

  const user = await User.findById(req.user._id).select('+password');

  // Wrong current password is a form validation issue, not an auth-session failure.
  if (!user || !(await user.matchPassword(currentPassword))) {
    throw createHttpError(400, 'Current password is incorrect.');
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully.' });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Signed out successfully.' });
});
