import { Router } from 'express';
import { createTechnician, deleteTechnician, getTechnicians, updateTechnician } from '../controllers/technicianController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.route('/').get(getTechnicians).post(createTechnician);
router.route('/:id').put(updateTechnician).delete(deleteTechnician);

export default router;
