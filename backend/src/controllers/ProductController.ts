import { Request, Response, NextFunction } from 'express';
import { ProductModel } from '../models/ProductModel';
import { CreateProductRequest, UpdateProductRequest } from '../types';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class ProductController {
  private productModel: ProductModel;

  constructor() {
    this.productModel = new ProductModel();
  }

  public getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt((req.query.page as string) || '1') || 1;
      const limit = parseInt((req.query.limit as string) || '10') || 10;
      const category = req.query.category as string;
      
      const offset = (page - 1) * limit;
      const products = await this.productModel.findAll(limit, offset, category);
      const total = await this.productModel.count(category);
      
      res.status(200).json({
        success: true,
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Product ID is required',
          },
        });
        return;
      }
      
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid product ID',
          },
        });
        return;
      }

      const product = await this.productModel.findById(id);
      if (!product) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Product not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Only admins can create products
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: {
            message: 'Only admins can create products',
          },
        });
        return;
      }

      const productData: CreateProductRequest = req.body;
      const product = await this.productModel.create(productData);

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Only admins can update products
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: {
            message: 'Only admins can update products',
          },
        });
        return;
      }

      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Product ID is required',
          },
        });
        return;
      }
      
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid product ID',
          },
        });
        return;
      }

      const productData: UpdateProductRequest = req.body;
      const product = await this.productModel.update(id, productData);

      if (!product) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Product not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Only admins can delete products
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: {
            message: 'Only admins can delete products',
          },
        });
        return;
      }

      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Product ID is required',
          },
        });
        return;
      }
      
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid product ID',
          },
        });
        return;
      }

      const result = await this.productModel.delete(id);
      if (!result) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Product not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          message: 'Product deleted successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public updateStock = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Only admins can update stock
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: {
            message: 'Only admins can update product stock',
          },
        });
        return;
      }

      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Product ID is required',
          },
        });
        return;
      }
      
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid product ID',
          },
        });
        return;
      }

      const { quantity } = req.body;
      const product = await this.productModel.updateStock(id, quantity);

      if (!product) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Product not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  public searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { q: searchTerm, limit: limitParam } = req.query;
      const limit = parseInt(limitParam as string) || 10;
      
      if (!searchTerm || typeof searchTerm !== 'string') {
        res.status(400).json({
          success: false,
          error: {
            message: 'Search term is required',
          },
        });
        return;
      }

      const products = await this.productModel.searchByName(searchTerm, limit);

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = req.params.category;
      const page = parseInt((req.query.page as string) || '1') || 1;
      const limit = parseInt((req.query.limit as string) || '10') || 10;
      
      const offset = (page - 1) * limit;
      const products = await this.productModel.findAll(limit, offset, category);
      const total = await this.productModel.count(category);
      
      res.status(200).json({
        success: true,
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}