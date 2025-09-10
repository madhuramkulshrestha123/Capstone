import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/ProductService';
import { ApiResponse } from '../types';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;

      const result = await this.productService.getAllProducts(page, limit, category);

      const response: ApiResponse = {
        success: true,
        data: result.products,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: result.totalPages,
        },
      };

      res.status(200).json(response);
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
          error: 'Product ID is required'
        });
        return;
      }
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID format'
        });
        return;
      }
      const product = await this.productService.getProductById(id);

      const response: ApiResponse = {
        success: true,
        data: product,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.createProduct(req.body);

      const response: ApiResponse = {
        success: true,
        data: product,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: 'Product ID is required'
        });
        return;
      }
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID format'
        });
        return;
      }
      const product = await this.productService.updateProduct(id, req.body);

      const response: ApiResponse = {
        success: true,
        data: product,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: 'Product ID is required'
        });
        return;
      }
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID format'
        });
        return;
      }
      await this.productService.deleteProduct(id);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Product deleted successfully',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: 'Product ID is required'
        });
        return;
      }
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID format'
        });
        return;
      }
      const { quantity } = req.body;
      
      const product = await this.productService.updateStock(id, quantity);

      const response: ApiResponse = {
        success: true,
        data: product,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const searchTerm = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const products = await this.productService.searchProducts(searchTerm, limit);

      const response: ApiResponse = {
        success: true,
        data: products,
        meta: {
          total: products.length,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = req.params.category;
      if (!category) {
        res.status(400).json({
          success: false,
          error: 'Category is required'
        });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.productService.getProductsByCategory(category, page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.products,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: result.totalPages,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}