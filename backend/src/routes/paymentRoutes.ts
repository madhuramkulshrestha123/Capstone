import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';
import { validateRequest, validateQuery, validateParams } from '../middlewares/validationMiddleware';
import {
  createPaymentSchema,
  updatePaymentSchema,
  paginationSchema,
  idParamSchema,
  projectIdParamSchema
} from '../utils/validationSchemas';

const router = Router();
const paymentController = new PaymentController();

// All payment routes require authentication
router.use(authenticateToken);

// Get all payments (Admin only)
router.get('/', requireAdmin, validateQuery(paginationSchema), paymentController.getAllPayments);

// Get payment by ID (Admin only)
router.get('/:id', requireAdmin, validateParams(idParamSchema), paymentController.getPaymentById);

// Create payment (Admin only)
router.post('/', requireAdmin, validateRequest(createPaymentSchema), paymentController.createPayment);

// Update payment (Admin only)
router.put('/:id', requireAdmin, validateParams(idParamSchema), validateRequest(updatePaymentSchema), paymentController.updatePayment);

// Delete payment (Admin only)
router.delete('/:id', requireAdmin, validateParams(idParamSchema), paymentController.deletePayment);

// Get my payments (Authenticated user - likely worker)
router.get('/my/payments', validateQuery(paginationSchema), paymentController.getMyPayments);

// Get payments by project (Admin)
router.get('/project/:projectId', requireAdmin, validateParams(projectIdParamSchema), validateQuery(paginationSchema), paymentController.getPaymentsByProject);

// Approve payment (Admin only)
router.patch('/:id/approve', requireAdmin, validateParams(idParamSchema), paymentController.approvePayment);

// Reject payment (Admin only)
router.patch('/:id/reject', requireAdmin, validateParams(idParamSchema), paymentController.rejectPayment);

// Mark payment as paid (Admin only)
router.patch('/:id/paid', requireAdmin, validateParams(idParamSchema), paymentController.markAsPaid);

// Generate payments from attendance (Admin only)
router.post('/generate-from-attendance/:projectId', requireAdmin, validateParams(projectIdParamSchema), paymentController.generatePaymentsFromAttendance);

export default router;