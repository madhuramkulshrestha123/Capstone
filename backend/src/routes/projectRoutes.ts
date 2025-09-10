import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';
import { validateRequest, validateQuery, validateParams } from '../middlewares/validationMiddleware';
import {
  createProjectSchema,
  updateProjectSchema,
  paginationSchema,
  idParamSchema,
} from '../utils/validationSchemas';

const router = Router();
const projectController = new ProjectController();

// All project routes require authentication
router.use(authenticateToken);

// Get all projects (All authenticated users)
router.get('/', validateQuery(paginationSchema), projectController.getAllProjects);

// Get project by ID (All authenticated users)
router.get('/:id', validateParams(idParamSchema), projectController.getProjectById);

// Create project (Admin only)
router.post('/', requireAdmin, validateRequest(createProjectSchema), projectController.createProject);

// Update project (Admin only)
router.put('/:id', requireAdmin, validateParams(idParamSchema), validateRequest(updateProjectSchema), projectController.updateProject);

// Delete project (Admin only)
router.delete('/:id', requireAdmin, validateParams(idParamSchema), projectController.deleteProject);

// Get my projects (All authenticated users)
router.get('/my/projects', validateQuery(paginationSchema), projectController.getMyProjects);

// Get projects by status (All authenticated users)
router.get('/status/:status', validateQuery(paginationSchema), projectController.getProjectsByStatus);

export default router;