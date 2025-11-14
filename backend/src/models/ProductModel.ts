import { Product, CreateProductRequest, UpdateProductRequest } from '../types';
import Database from '../config/database';

export class ProductModel {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findAll(limit: number = 10, offset: number = 0, category?: string): Promise<Product[]> {
    let query = `
      SELECT id, name, description, price, "imageUrl", category, "stockQuantity", "isActive", "createdAt", "updatedAt"
      FROM products
      WHERE "isActive" = true
    `;
    const params: any[] = [];

    if (category) {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }

    query += ` ORDER BY "createdAt" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await this.db.query(query, params);
    return result.rows;
  }

  async findById(id: number): Promise<Product | null> {
    const query = `
      SELECT id, name, description, price, "imageUrl", category, "stockQuantity", "isActive", "createdAt", "updatedAt"
      FROM products
      WHERE id = $1 AND "isActive" = true
    `;
    const result = await this.db.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async create(productData: CreateProductRequest): Promise<Product> {
    const now = new Date().toISOString();
    const query = `
      INSERT INTO products (name, description, price, "imageUrl", category, "stockQuantity", "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, name, description, price, "imageUrl", category, "stockQuantity", "isActive", "createdAt", "updatedAt"
    `;
    const values = [
      productData.name,
      productData.description || null,
      productData.price,
      productData.image_url || null,
      productData.category || null,
      productData.stock_quantity || 0,
      true,
      now,
      now
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async update(id: number, productData: UpdateProductRequest): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (productData.name !== undefined) {
      fields.push(`name = $${fields.length + 1}`);
      values.push(productData.name);
    }
    if (productData.description !== undefined) {
      fields.push(`description = $${fields.length + 1}`);
      values.push(productData.description);
    }
    if (productData.price !== undefined) {
      fields.push(`price = $${fields.length + 1}`);
      values.push(productData.price);
    }
    if (productData.image_url !== undefined) {
      fields.push(`"imageUrl" = $${fields.length + 1}`);
      values.push(productData.image_url);
    }
    if (productData.category !== undefined) {
      fields.push(`category = $${fields.length + 1}`);
      values.push(productData.category);
    }
    if (productData.stock_quantity !== undefined) {
      fields.push(`"stockQuantity" = $${fields.length + 1}`);
      values.push(productData.stock_quantity);
    }
    if (productData.is_active !== undefined) {
      fields.push(`"isActive" = $${fields.length + 1}`);
      values.push(productData.is_active);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    const query = `
      UPDATE products
      SET ${fields.join(', ')}, "updatedAt" = NOW()
      WHERE id = $${fields.length + 1} AND "isActive" = true
      RETURNING id, name, description, price, "imageUrl", category, "stockQuantity", "isActive", "createdAt", "updatedAt"
    `;
    values.push(id);

    try {
      const result = await this.db.query(query, values);
      if (result.rows.length === 0) return null;
      return result.rows[0];
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        UPDATE products
        SET "isActive" = false, "updatedAt" = NOW()
        WHERE id = $1 AND "isActive" = true
      `;
      const result = await this.db.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      return false;
    }
  }

  async count(category?: string): Promise<number> {
    let query = 'SELECT COUNT(*) FROM products WHERE "isActive" = true';
    const params: any[] = [];

    if (category) {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }

    const result = await this.db.query(query, params);
    return parseInt(result.rows[0].count);
  }

  async updateStock(id: number, quantity: number): Promise<Product | null> {
    try {
      const query = `
        UPDATE products
        SET "stockQuantity" = "stockQuantity" + $1, "updatedAt" = NOW()
        WHERE id = $2 AND "isActive" = true
        RETURNING id, name, description, price, "imageUrl", category, "stockQuantity", "isActive", "createdAt", "updatedAt"
      `;
      const result = await this.db.query(query, [quantity, id]);
      
      if (result.rows.length === 0) return null;
      return result.rows[0];
    } catch (error) {
      return null;
    }
  }

  async searchByName(searchTerm: string, limit: number = 10): Promise<Product[]> {
    const query = `
      SELECT id, name, description, price, "imageUrl", category, "stockQuantity", "isActive", "createdAt", "updatedAt"
      FROM products
      WHERE "isActive" = true AND name ILIKE $1
      ORDER BY name ASC
      LIMIT $2
    `;
    const result = await this.db.query(query, [`%${searchTerm}%`, limit]);
    return result.rows;
  }
}