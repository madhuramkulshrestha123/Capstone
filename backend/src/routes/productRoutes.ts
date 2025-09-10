import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticateToken, optionalAuth } from '../middlewares/authMiddleware';
import { validateRequest, validateQuery, validateParams } from '../middlewares/validationMiddleware';
import {
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
  paginationSchema,
  searchSchema,
  idParamSchema,
} from '../utils/validationSchemas';

const router = Router();
const productController = new ProductController();

// Public routes (no authentication required)
router.get('/', validateQuery(paginationSchema), productController.getAllProducts);
router.get('/search', validateQuery(searchSchema), productController.searchProducts);
router.get('/category/:category', validateQuery(paginationSchema), productController.getProductsByCategory);
router.get('/:id', validateParams(idParamSchema), productController.getProductById);

// Protected routes (authentication required)
router.use(authenticateToken);

router.post('/', validateRequest(createProductSchema), productController.createProduct);
router.put('/:id', validateParams(idParamSchema), validateRequest(updateProductSchema), productController.updateProduct);
router.delete('/:id', validateParams(idParamSchema), productController.deleteProduct);
router.patch('/:id/stock', validateParams(idParamSchema), validateRequest(updateStockSchema), productController.updateStock);

export default router;