import User from '../models/User.js';
import { sendPasswordResetOtpEmail } from '../config/mailer.js';
import { env } from '../config/env.js';
import {
  clearAuthCookie,
  clearPasswordResetCookie,
  setAuthCookie,
  setPasswordResetCookie
} from '../utils/authCookies.js';
import { createToken } from '../utils/createToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createHttpError } from '../utils/httpError.js';
import {
  comparePasswordResetOtp,
  comparePasswordResetSessionToken,
  createExpiryFromNow,
  generatePasswordResetOtp,
  generatePasswordResetSessionToken,
  hashPasswordResetOtp,
  hashPasswordResetSessionToken
} from '../utils/passwordReset.js';
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

const genericForgotPasswordMessage =
  'If an account exists for that email address, a verification code has been sent.';

const resetSecretFields =
  '+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpAttempts +passwordResetLastSentAt +passwordResetTokenHash +passwordResetTokenExpiresAt';

const clearPasswordResetChallenge = (user) => {
  user.passwordResetOtpHash = null;
  user.passwordResetOtpExpiresAt = null;
  user.passwordResetOtpAttempts = 0;
};

const clearPasswordResetSession = (user) => {
  user.passwordResetTokenHash = null;
  user.passwordResetTokenExpiresAt = null;
};

export const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email, { required: true });
  const password = readSecretInput(req.body.password, 'Password');
  const remember = Boolean(req.body.remember);

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw createHttpError(401, 'Invalid email or password.');
  }

  clearPasswordResetCookie(res);
  setAuthCookie(res, createToken(user._id), remember);

  res.json({
    user: sanitizeUser(user)
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

  const user = await User.findById(req.user._id).select(`+password ${resetSecretFields}`);

  // Wrong current password is a form validation issue, not an auth-session failure.
  if (!user || !(await user.matchPassword(currentPassword))) {
    throw createHttpError(400, 'Current password is incorrect.');
  }

  user.password = newPassword;
  clearPasswordResetChallenge(user);
  clearPasswordResetSession(user);
  user.passwordResetLastSentAt = null;
  await user.save();
  clearPasswordResetCookie(res);

  res.json({ message: 'Password updated successfully.' });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  clearPasswordResetCookie(res);
  res.json({ message: 'Signed out successfully.' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email, { required: true });
  const user = await User.findOne({ email }).select(resetSecretFields);

  clearPasswordResetCookie(res);

  if (user) {
    const now = new Date();
    const resendAllowedAt = new Date(now.getTime() - env.passwordResetResendCooldownSeconds * 1000);

    if (!user.passwordResetLastSentAt || user.passwordResetLastSentAt <= resendAllowedAt) {
      const otp = generatePasswordResetOtp();

      user.passwordResetOtpHash = await hashPasswordResetOtp(otp);
      user.passwordResetOtpExpiresAt = createExpiryFromNow(env.passwordResetOtpExpiresMinutes);
      user.passwordResetOtpAttempts = 0;
      user.passwordResetLastSentAt = now;
      clearPasswordResetSession(user);

      await user.save();

      try {
        // The API always returns the same message so we do not reveal whether an email exists.
        await sendPasswordResetOtpEmail({
          email: user.email,
          name: user.name,
          otp
        });
      } catch (error) {
        console.error('Failed to send password reset OTP:', error.message);
      }
    }
  }

  res.json({ message: genericForgotPasswordMessage });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email, { required: true });
  const otp = normalizeString(req.body.otp, {
    field: 'OTP',
    required: true,
    min: 6,
    max: 6
  });
  const user = await User.findOne({ email }).select(resetSecretFields);

  if (!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
    throw createHttpError(400, 'Invalid or expired OTP.');
  }

  if (user.passwordResetOtpExpiresAt <= new Date()) {
    clearPasswordResetChallenge(user);
    clearPasswordResetSession(user);
    await user.save();
    clearPasswordResetCookie(res);
    throw createHttpError(400, 'Invalid or expired OTP.');
  }

  const otpMatches = await comparePasswordResetOtp(otp, user.passwordResetOtpHash);

  if (!otpMatches) {
    user.passwordResetOtpAttempts = Number(user.passwordResetOtpAttempts || 0) + 1;

    if (user.passwordResetOtpAttempts >= env.passwordResetMaxAttempts) {
      clearPasswordResetChallenge(user);
      clearPasswordResetSession(user);
    }

    await user.save();
    throw createHttpError(400, 'Invalid or expired OTP.');
  }

  const passwordResetSessionToken = generatePasswordResetSessionToken();

  clearPasswordResetChallenge(user);
  user.passwordResetTokenHash = hashPasswordResetSessionToken(passwordResetSessionToken);
  user.passwordResetTokenExpiresAt = createExpiryFromNow(env.passwordResetSessionExpiresMinutes);
  await user.save();

  // Keep the verified reset session in an HttpOnly cookie so the frontend never handles the token directly.
  setPasswordResetCookie(res, passwordResetSessionToken);

  res.json({
    message: 'OTP verified successfully. You can now reset your password.'
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email, { required: true });
  const newPassword = ensurePasswordStrength(req.body.newPassword, {
    field: 'New password'
  });
  const confirmPassword = readSecretInput(req.body.confirmPassword, 'Confirm password');
  const passwordResetSessionToken = req.cookies?.[env.passwordResetCookieName];

  if (newPassword !== confirmPassword) {
    throw createHttpError(400, 'New password and confirm password must match.');
  }

  if (!passwordResetSessionToken) {
    throw createHttpError(401, 'Your password reset session is missing or has expired.');
  }

  const user = await User.findOne({ email }).select(`+password ${resetSecretFields}`);

  if (
    !user ||
    !user.passwordResetTokenHash ||
    !user.passwordResetTokenExpiresAt ||
    user.passwordResetTokenExpiresAt <= new Date() ||
    !comparePasswordResetSessionToken(passwordResetSessionToken, user.passwordResetTokenHash)
  ) {
    clearPasswordResetCookie(res);
    throw createHttpError(401, 'Your password reset session is invalid or has expired.');
  }

  user.password = newPassword;
  clearPasswordResetChallenge(user);
  clearPasswordResetSession(user);
  user.passwordResetLastSentAt = null;
  await user.save();

  clearPasswordResetCookie(res);

  res.json({
    message: 'Password reset successfully. You can now sign in with your new password.'
  });
});
