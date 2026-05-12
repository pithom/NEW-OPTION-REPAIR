import { Router } from 'express';
import { submitContactForm } from '../controllers/publicController.js';

const router = Router();

router.post('/contact', submitContactForm);

export default router;
