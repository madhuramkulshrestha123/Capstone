import { Router } from 'express';
import { JobCardController } from '../controllers/JobCardController';
import { validateRequest } from '../middlewares/validationMiddleware';
import { jobCardRegistrationSchema } from '../utils/validationSchemas';

const router = Router();
const jobCardController = new JobCardController();

// Public routes
router.post('/register', validateRequest(jobCardRegistrationSchema), jobCardController.registerJobCard);

export default router;