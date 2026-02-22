import { Router } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';
import { validateRequest, validateQuery, validateParams } from '../middlewares/validationMiddleware';
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  paginationSchema,
  idParamSchema,
  projectIdParamSchema
} from '../utils/validationSchemas';

const router = Router();
const attendanceController = new AttendanceController();

// All attendance routes require authentication
router.use(authenticateToken);

// Get all attendances (Admin only)
router.get('/', requireAdmin, validateQuery(paginationSchema), attendanceController.getAllAttendances);

// Get attendance by ID (Admin only)
router.get('/:id', requireAdmin, validateParams(idParamSchema), attendanceController.getAttendanceById);

// Mark attendance (Admin only)
router.post('/', requireAdmin, validateRequest(createAttendanceSchema), attendanceController.markAttendance);

// Update attendance (Admin only)
router.put('/:id', requireAdmin, validateParams(idParamSchema), validateRequest(updateAttendanceSchema), attendanceController.updateAttendance);

// Delete attendance (Admin only)
router.delete('/:id', requireAdmin, validateParams(idParamSchema), attendanceController.deleteAttendance);

// Get my attendances (Supervisor/Worker - they can view their own attendances)
router.get('/my/attendances', validateQuery(paginationSchema), attendanceController.getMyAttendances);

// Get attendances by project (Admin only)
router.get('/project/:projectId', requireAdmin, validateParams(projectIdParamSchema), validateQuery(paginationSchema), attendanceController.getAttendancesByProject);

// Get attendances by date range (Admin only)
router.get('/project/:projectId/date-range', requireAdmin, validateParams(projectIdParamSchema), attendanceController.getAttendancesByDateRange);

export default router;