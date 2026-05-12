import ContactMessage from '../models/ContactMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { normalizeEmail, normalizeString } from '../utils/validation.js';

export const submitContactForm = asyncHandler(async (req, res) => {
  const name = normalizeString(req.body.name, { field: 'Name', required: true, max: 120 });
  const email = normalizeEmail(req.body.email, { required: true });
  const message = normalizeString(req.body.message, {
    field: 'Message',
    required: true,
    max: 2000
  });

  await ContactMessage.create({ name, email, message });

  res.status(201).json({
    message: 'Your message has been received. We will get back to you shortly.'
  });
});
