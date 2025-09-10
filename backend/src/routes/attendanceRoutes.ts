import { Router } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';
import { authenticateToken, requireAdmin, requireSupervisor, requireSupervisorOrAdmin, requireWorker } from '../middlewares/authMiddleware';
import { validateRequest, validateQuery, validateParams } from '../middlewares/validationMiddleware';
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  paginationSchema,
  idParamSchema,
} from '../utils/validationSchemas';

const router = Router();
const attendanceController = new AttendanceController();

// All attendance routes require authentication
router.use(authenticateToken);

// Get all attendances (Admin only)
router.get('/', requireAdmin, validateQuery(paginationSchema), attendanceController.getAllAttendances);

// Get attendance by ID (Admin only)
router.get('/:id', requireAdmin, validateParams(idParamSchema), attendanceController.getAttendanceById);

// Mark attendance (Supervisor/Admin only)
router.post('/', requireSupervisorOrAdmin, validateRequest(createAttendanceSchema), attendanceController.markAttendance);

// Update attendance (Supervisor/Admin only)
router.put('/:id', requireSupervisorOrAdmin, validateParams(idParamSchema), validateRequest(updateAttendanceSchema), attendanceController.updateAttendance);

// Delete attendance (Admin only)
router.delete('/:id', requireAdmin, validateParams(idParamSchema), attendanceController.deleteAttendance);

// Get my attendances (Worker)
router.get('/my/attendances', requireWorker, validateQuery(paginationSchema), attendanceController.getMyAttendances);

// Get attendances by project (Admin/Supervisor)
router.get('/project/:projectId', requireSupervisorOrAdmin, validateParams(idParamSchema), validateQuery(paginationSchema), attendanceController.getAttendancesByProject);

// Get attendances by date range (Admin/Supervisor)
router.get('/project/:projectId/date-range', requireSupervisorOrAdmin, validateParams(idParamSchema), attendanceController.getAttendancesByDateRange);

export default router;