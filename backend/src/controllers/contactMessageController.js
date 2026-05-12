import ContactMessage from '../models/ContactMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const ensureAdmin = (req, res) => {
  if (req.user?.role !== 'admin') {
    res.status(403);
    throw new Error('Admin access is required.');
  }
};

export const getContactMessages = asyncHandler(async (req, res) => {
  ensureAdmin(req, res);

  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
});

export const getUnreadContactMessagesCount = asyncHandler(async (req, res) => {
  ensureAdmin(req, res);

  const count = await ContactMessage.countDocuments({ isRead: { $ne: true } });
  res.json({ count });
});

export const markAllContactMessagesRead = asyncHandler(async (req, res) => {
  ensureAdmin(req, res);

  const result = await ContactMessage.updateMany(
    { isRead: { $ne: true } },
    {
      $set: {
        isRead: true,
        readAt: new Date()
      }
    }
  );

  res.json({
    message: 'All messages marked as read.',
    updated: result.modifiedCount || 0
  });
});
