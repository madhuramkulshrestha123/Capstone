import { Router } from 'express';
import { ChatbotController } from '../controllers/ChatbotController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
const chatbotController = new ChatbotController();

// Public routes
router.get('/job-card/:jobCardId', chatbotController.getJobCardData);
router.get('/project/:projectId', chatbotController.getProjectData);
router.get('/payment/:paymentId', chatbotController.getPaymentData);

// Protected routes (require authentication)
router.post('/query', authenticateToken, chatbotController.processUserQuery);

export default router;