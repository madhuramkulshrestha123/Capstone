import { ProductModel } from '../models/ProductModel';
import { AppError } from '../middlewares/errorMiddleware';
import { CreateProductRequest, UpdateProductRequest, Product } from '../types';

export class ProductService {
  private productModel: ProductModel;

  constructor() {
    this.productModel = new ProductModel();
  }

  async getAllProducts(
    page: number = 1,
    limit: number = 10,
    category?: string
  ): Promise<{
    products: Product[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.productModel.findAll(limit, offset, category),
      this.productModel.count(category),
    ]);

    return {
      products,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    // Validate product data
    if (productData.price <= 0) {
      throw new AppError('Product price must be greater than 0', 400);
    }

    if (productData.stock_quantity && productData.stock_quantity < 0) {
      throw new AppError('Stock quantity cannot be negative', 400);
    }

    const product = await this.productModel.create(productData);
    return product;
  }

  async updateProduct(id: number, productData: UpdateProductRequest): Promise<Product> {
    // Check if product exists
    const existingProduct = await this.productModel.findById(id);
    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }

    // Validate updated data
    if (productData.price !== undefined && productData.price <= 0) {
      throw new AppError('Product price must be greater than 0', 400);
    }

    if (productData.stock_quantity !== undefined && productData.stock_quantity < 0) {
      throw new AppError('Stock quantity cannot be negative', 400);
    }

    const updatedProduct = await this.productModel.update(id, productData);
    if (!updatedProduct) {
      throw new AppError('Failed to update product', 500);
    }

    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const deleted = await this.productModel.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete product', 500);
    }
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if stock would go negative
    if (product.stock_quantity + quantity < 0) {
      throw new AppError('Insufficient stock quantity', 400);
    }

    const updatedProduct = await this.productModel.updateStock(id, quantity);
    if (!updatedProduct) {
      throw new AppError('Failed to update stock', 500);
    }

    return updatedProduct;
  }

  async searchProducts(searchTerm: string, limit: number = 10): Promise<Product[]> {
    if (!searchTerm.trim()) {
      throw new AppError('Search term is required', 400);
    }

    return await this.productModel.searchByName(searchTerm.trim(), limit);
  }

  async getProductsByCategory(category: string, page: number = 1, limit: number = 10): Promise<{
    products: Product[];
    total: number;
    totalPages: number;
  }> {
    return this.getAllProducts(page, limit, category);
  }
}