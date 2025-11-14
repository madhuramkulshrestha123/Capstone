import { Router } from 'express';
import { AdminJobCardApplicationController } from '../../controllers/AdminJobCardApplicationController';

const router = Router();
const adminJobCardApplicationController = new AdminJobCardApplicationController();

// Admin routes (these would be protected by authentication middleware in a real implementation)
router.patch('/applications/:trackingId/approve', adminJobCardApplicationController.approveApplication);
router.patch('/applications/:trackingId/reject', adminJobCardApplicationController.rejectApplication);

export default router;