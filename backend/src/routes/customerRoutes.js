import { Router } from 'express';
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from '../controllers/customerController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.route('/').get(getCustomers).post(createCustomer);
router.route('/:id').put(updateCustomer).delete(deleteCustomer);

export default router;
