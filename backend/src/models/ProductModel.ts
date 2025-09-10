import Database from '../config/database';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types';
import { PrismaClient } from '@prisma/client';

// Define the Prisma product type based on the database schema
interface PrismaProduct {
  id: number;
  name: string;
  description: string | null;
  price: any; // Prisma Decimal type
  imageUrl: string | null;
  category: string | null;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductModel {
  private prisma: PrismaClient;

  constructor() {
    const db = Database.getInstance();
    this.prisma = db.client;
  }

  async findAll(limit: number = 10, offset: number = 0, category?: string): Promise<Product[]> {
    const whereClause: any = {
      isActive: true,
    };

    if (category) {
      whereClause.category = category;
    }

    const products = await this.prisma.product.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return products.map((product: PrismaProduct) => ({
      ...product,
      price: Number(product.price),
      image_url: product.imageUrl,
      stock_quantity: product.stockQuantity,
      is_active: product.isActive,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    })) as Product[];
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!product) return null;

    return {
      ...product,
      price: Number(product.price),
      image_url: product.imageUrl,
      stock_quantity: product.stockQuantity,
      is_active: product.isActive,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    } as Product;
  }

  async create(productData: CreateProductRequest): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description || null,
        price: productData.price,
        imageUrl: productData.image_url || null,
        category: productData.category || null,
        stockQuantity: productData.stock_quantity || 0,
      },
    });

    return {
      ...product,
      price: Number(product.price),
      image_url: product.imageUrl,
      stock_quantity: product.stockQuantity,
      is_active: product.isActive,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    } as Product;
  }

  async update(id: number, productData: UpdateProductRequest): Promise<Product | null> {
    const updateData: any = {};

    if (productData.name !== undefined) updateData.name = productData.name;
    if (productData.description !== undefined) updateData.description = productData.description;
    if (productData.price !== undefined) updateData.price = productData.price;
    if (productData.image_url !== undefined) updateData.imageUrl = productData.image_url;
    if (productData.category !== undefined) updateData.category = productData.category;
    if (productData.stock_quantity !== undefined) updateData.stockQuantity = productData.stock_quantity;
    if (productData.is_active !== undefined) updateData.isActive = productData.is_active;

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    try {
      const product = await this.prisma.product.update({
        where: {
          id,
          isActive: true,
        },
        data: updateData,
      });

      return {
        ...product,
        price: Number(product.price),
        image_url: product.imageUrl,
        stock_quantity: product.stockQuantity,
        is_active: product.isActive,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      } as Product;
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.product.update({
        where: {
          id,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async count(category?: string): Promise<number> {
    const whereClause: any = {
      isActive: true,
    };

    if (category) {
      whereClause.category = category;
    }

    return await this.prisma.product.count({
      where: whereClause,
    });
  }

  async updateStock(id: number, quantity: number): Promise<Product | null> {
    try {
      const product = await this.prisma.product.update({
        where: {
          id,
          isActive: true,
        },
        data: {
          stockQuantity: {
            increment: quantity,
          },
        },
      });

      return {
        ...product,
        price: Number(product.price),
        image_url: product.imageUrl,
        stock_quantity: product.stockQuantity,
        is_active: product.isActive,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      } as Product;
    } catch (error) {
      return null;
    }
  }

  async searchByName(searchTerm: string, limit: number = 10): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
    });

    return products.map((product: PrismaProduct) => ({
      ...product,
      price: Number(product.price),
      image_url: product.imageUrl,
      stock_quantity: product.stockQuantity,
      is_active: product.isActive,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    })) as Product[];
  }
}