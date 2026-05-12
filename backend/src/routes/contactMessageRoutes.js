import { Router } from 'express';
import {
  getContactMessages,
  getUnreadContactMessagesCount,
  markAllContactMessagesRead
} from '../controllers/contactMessageController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/unread-count', getUnreadContactMessagesCount);
router.patch('/mark-all-read', markAllContactMessagesRead);
router.get('/', getContactMessages);

export default router;
