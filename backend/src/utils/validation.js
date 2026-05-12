import mongoose from 'mongoose';
import { createHttpError } from './httpError.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+().\-\s]{7,24}$/;

const collapseWhitespace = (value) => String(value).trim().replace(/\s+/g, ' ');

export const normalizeString = (value, options = {}) => {
  const { field = 'Value', required = false, min = 1, max = 255 } = options;

  if (value === undefined || value === null) {
    if (required) {
      throw createHttpError(400, `${field} is required.`);
    }

    return '';
  }

  const normalized = collapseWhitespace(value);

  if (!normalized) {
    if (required) {
      throw createHttpError(400, `${field} is required.`);
    }

    return '';
  }

  if (normalized.length < min) {
    throw createHttpError(400, `${field} must be at least ${min} characters long.`);
  }

  if (normalized.length > max) {
    throw createHttpError(400, `${field} must be ${max} characters or fewer.`);
  }

  return normalized;
};

export const normalizeOptionalString = (value, options = {}) => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return '';
  }

  return normalizeString(value, { ...options, required: false });
};

export const normalizeEmail = (value, options = {}) => {
  const { field = 'Email', required = false } = options;
  const normalized = required
    ? normalizeString(value, { field, required: true, max: 254 })
    : normalizeOptionalString(value, { field, max: 254 });

  if (!normalized) {
    return '';
  }

  const email = normalized.toLowerCase();

  if (!emailPattern.test(email)) {
    throw createHttpError(400, 'Enter a valid email address.');
  }

  return email;
};

export const normalizePhone = (value, options = {}) => {
  const { field = 'Phone number', required = false } = options;
  const normalized = required
    ? normalizeString(value, { field, required: true, max: 24 })
    : normalizeOptionalString(value, { field, max: 24 });

  if (!normalized) {
    return '';
  }

  if (!phonePattern.test(normalized)) {
    throw createHttpError(400, `${field} format is invalid.`);
  }

  return normalized;
};

export const normalizeObjectId = (value, options = {}) => {
  const { field = 'Record', required = false } = options;

  if (!value) {
    if (required) {
      throw createHttpError(400, `${field} is required.`);
    }

    return null;
  }

  if (!mongoose.isValidObjectId(value)) {
    throw createHttpError(400, `${field} is invalid.`);
  }

  return value;
};

export const normalizeNumber = (value, options = {}) => {
  const { field = 'Number', defaultValue = 0, min = 0, max = 100000000 } = options;

  if (value === '' || value === undefined || value === null) {
    return defaultValue;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    throw createHttpError(400, `${field} must be a valid number.`);
  }

  if (numericValue < min) {
    throw createHttpError(400, `${field} cannot be less than ${min}.`);
  }

  if (numericValue > max) {
    throw createHttpError(400, `${field} cannot be greater than ${max}.`);
  }

  return numericValue;
};

export const normalizeDate = (value, options = {}) => {
  const { field = 'Date', required = false } = options;

  if (!value) {
    if (required) {
      throw createHttpError(400, `${field} is required.`);
    }

    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw createHttpError(400, `${field} is invalid.`);
  }

  return parsed;
};

export const normalizeBoolean = (value, options = {}) => {
  const { defaultValue = false } = options;

  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true' || value === '1' || value === 1) {
    return true;
  }

  if (value === 'false' || value === '0' || value === 0) {
    return false;
  }

  return defaultValue;
};

export const normalizeEnum = (value, options = {}) => {
  const { field = 'Value', allowed = [], defaultValue = '' } = options;
  const normalized = normalizeOptionalString(value, { field, max: 40 });

  if (!normalized) {
    return defaultValue;
  }

  if (!allowed.includes(normalized)) {
    throw createHttpError(400, `${field} is invalid.`);
  }

  return normalized;
};

export const ensurePasswordStrength = (value, options = {}) => {
  const { field = 'Password' } = options;
  const password = String(value || '');

  if (password.length < 4) {
    throw createHttpError(400, `${field} must be at least 4 characters long.`);
  }

  return password;
};
