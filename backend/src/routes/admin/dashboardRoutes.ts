import { Router } from 'express';
import { AdminDashboardController } from '../../controllers/AdminDashboardController';
import { authenticateToken, requireAdmin } from '../../middlewares/authMiddleware';

const router = Router();
const adminDashboardController = new AdminDashboardController();

// Admin dashboard routes (protected by authentication and admin authorization)
router.get('/dashboard/stats', authenticateToken, requireAdmin, adminDashboardController.getDashboardStats);
router.get('/dashboard/recent-activities', authenticateToken, requireAdmin, adminDashboardController.getRecentActivities);
router.get('/dashboard/pending-applications', authenticateToken, requireAdmin, adminDashboardController.getPendingJobCardApplications);

export default router;