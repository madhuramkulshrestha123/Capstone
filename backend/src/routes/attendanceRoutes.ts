import { Router } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';
import { authenticateToken, requireAdmin, requireSupervisor } from '../middlewares/authMiddleware';
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

// Mark attendance (Supervisor only)
router.post('/', requireSupervisor, validateRequest(createAttendanceSchema), attendanceController.markAttendance);

// Update attendance (Supervisor only)
router.put('/:id', requireSupervisor, validateParams(idParamSchema), validateRequest(updateAttendanceSchema), attendanceController.updateAttendance);

// Delete attendance (Admin only)
router.delete('/:id', requireAdmin, validateParams(idParamSchema), attendanceController.deleteAttendance);

// Get my attendances (Supervisor - they can view their own attendances)
router.get('/my/attendances', requireSupervisor, validateQuery(paginationSchema), attendanceController.getMyAttendances);

// Get attendances by project (Admin/Supervisor)
router.get('/project/:projectId', requireSupervisor, validateParams(projectIdParamSchema), validateQuery(paginationSchema), attendanceController.getAttendancesByProject);

// Get attendances by date range (Admin/Supervisor)
router.get('/project/:projectId/date-range', requireSupervisor, validateParams(projectIdParamSchema), attendanceController.getAttendancesByDateRange);

export default router;