import { Router } from 'express';
import { createRepair, deleteRepair, getRepairs, updateRepair } from '../controllers/repairController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.route('/').get(getRepairs).post(createRepair);
router.route('/:id').put(updateRepair).delete(deleteRepair);

export default router;
