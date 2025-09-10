import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';
import { validateRequest, validateQuery, validateParams } from '../middlewares/validationMiddleware';
import {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  refreshTokenSchema,
  paginationSchema,
  idParamSchema,
} from '../utils/validationSchemas';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', validateRequest(createUserSchema), userController.createUser);
router.post('/login', validateRequest(loginSchema), userController.login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), userController.refreshToken);

// Protected routes
router.use(authenticateToken);

// Profile routes (All authenticated users)
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// User management routes (Admin only for list and delete operations)
router.get('/', requireAdmin, validateQuery(paginationSchema), userController.getAllUsers);
router.get('/:id', requireAdmin, validateParams(idParamSchema), userController.getUserById);
router.put('/:id', requireAdmin, validateParams(idParamSchema), validateRequest(updateUserSchema), userController.updateUser);
router.delete('/:id', requireAdmin, validateParams(idParamSchema), userController.deleteUser);

export default router;