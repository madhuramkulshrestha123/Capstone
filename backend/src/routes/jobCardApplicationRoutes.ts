import { Router } from 'express';
import { JobCardApplicationController } from '../controllers/JobCardApplicationController';
import { validateRequest } from '../middlewares/validationMiddleware';
import { jobCardRegistrationSchema } from '../utils/validationSchemas';
import upload from '../middlewares/uploadMiddleware';

const router = Router();
const jobCardApplicationController = new JobCardApplicationController();

// Public routes
router.post('/submit', upload.single('image'), validateRequest(jobCardRegistrationSchema), jobCardApplicationController.submitApplication);
router.get('/track/:trackingId', jobCardApplicationController.getApplicationByTrackingId);

// Admin routes (in a real implementation, these would be protected)
router.get('/applications', jobCardApplicationController.getAllApplications);
router.get('/applications/status/:status', jobCardApplicationController.getApplicationsByStatus);

export default router;