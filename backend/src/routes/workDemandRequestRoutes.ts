import { Router } from 'express';
import { WorkDemandRequestController } from '../controllers/WorkDemandRequestController';
import { authenticateToken, requireAdmin, requireSupervisor } from '../middlewares/authMiddleware';
import { validateRequest, validateQuery, validateParams } from '../middlewares/validationMiddleware';
import {
  createWorkDemandRequestSchema,
  updateWorkDemandRequestSchema,
  paginationSchema,
  idParamSchema,
  projectIdParamSchema
} from '../utils/validationSchemas';

const router = Router();
const workDemandRequestController = new WorkDemandRequestController();

// All work demand request routes require authentication
router.use(authenticateToken);

// Get all requests (Admin only)
router.get('/', requireAdmin, validateQuery(paginationSchema), workDemandRequestController.getRequests);

// Get request by ID (Admin only)
router.get('/:id', requireAdmin, validateParams(idParamSchema), workDemandRequestController.getRequestById);

// Create request (Supervisor only)
router.post('/', requireSupervisor, validateRequest(createWorkDemandRequestSchema), workDemandRequestController.createRequest);

// Update request (Admin only)
router.put('/:id', requireAdmin, validateParams(idParamSchema), validateRequest(updateWorkDemandRequestSchema), workDemandRequestController.updateRequest);

// Delete request (Admin only)
router.delete('/:id', requireAdmin, validateParams(idParamSchema), workDemandRequestController.deleteRequest);

// Get my requests (Supervisor)
router.get('/my/requests', requireSupervisor, validateQuery(paginationSchema), workDemandRequestController.getMyRequests);

// Get requests by project (Admin)
router.get('/project/:projectId', requireAdmin, validateParams(projectIdParamSchema), validateQuery(paginationSchema), workDemandRequestController.getRequestsByProject);

// Approve request (Admin only)
router.patch('/:id/approve', requireAdmin, validateParams(idParamSchema), workDemandRequestController.approveRequest);

// Reject request (Admin only)
router.patch('/:id/reject', requireAdmin, validateParams(idParamSchema), workDemandRequestController.rejectRequest);

export default router;