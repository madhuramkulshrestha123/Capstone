import Database from '../config/database';
import { Payment, CreatePaymentRequest, UpdatePaymentRequest } from '../types';

export class PaymentModel {
  private db: any;

  constructor() {
    const db = Database.getInstance();
    this.db = db.client;
  }

  async findAll(limit: number = 10, offset: number = 0, status?: string): Promise<Payment[]> {
    let query = 'SELECT * FROM payments ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    let params: any[] = [limit, offset];
    
    if (status) {
      query = 'SELECT * FROM payments WHERE status = $3 ORDER BY created_at DESC LIMIT $1 OFFSET $2';
      params = [limit, offset, status];
    }

    const result = await this.db.query(query, params);
    
    return result.rows.map((payment: any) => ({
      ...payment,
      worker_id: payment.worker_id,
      project_id: payment.project_id,
      approved_by: payment.approved_by,
      approved_at: payment.approved_at,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      amount: parseFloat(payment.amount),
    }));
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await this.db.query('SELECT * FROM payments WHERE id = $1', [id]);
    
    if (result.rows.length === 0) return null;
    
    const payment = result.rows[0];
    return {
      ...payment,
      worker_id: payment.worker_id,
      project_id: payment.project_id,
      approved_by: payment.approved_by,
      approved_at: payment.approved_at,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      amount: parseFloat(payment.amount),
    };
  }

  async create(paymentData: CreatePaymentRequest): Promise<Payment> {
    const result = await this.db.query(
      `INSERT INTO payments (
        worker_id, project_id, amount, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [
        paymentData.worker_id,
        paymentData.project_id,
        paymentData.amount,
        'PENDING'
      ]
    );
    
    const payment = result.rows[0];
    return {
      ...payment,
      worker_id: payment.worker_id,
      project_id: payment.project_id,
      approved_by: payment.approved_by,
      approved_at: payment.approved_at,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      amount: parseFloat(payment.amount),
    };
  }

  async update(id: string, paymentData: UpdatePaymentRequest, adminId?: string): Promise<Payment | null> {
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    // Build dynamic update query based on provided fields
    if (paymentData.status !== undefined) {
      updateFields.push(`status = $${paramCount}`);
      values.push(paymentData.status);
      paramCount++;
      
      // Set approvedAt timestamp when status is changed to APPROVED
      if (paymentData.status === 'APPROVED' && adminId) {
        updateFields.push(`approved_by = $${paramCount}`);
        values.push(adminId);
        paramCount++;
        updateFields.push(`approved_at = NOW()`);
      }
      
      // Set paidAt timestamp when status is changed to PAID
      if (paymentData.status === 'PAID') {
        updateFields.push(`paid_at = NOW()`);
      }
    }
    
    if (paymentData.approved_by !== undefined) {
      updateFields.push(`approved_by = $${paramCount}`);
      values.push(paymentData.approved_by);
      paramCount++;
    }
    
    // If no fields to update, return the existing payment
    if (updateFields.length === 0) {
      return this.findById(id);
    }
    
    // Add updated_at timestamp
    updateFields.push(`updated_at = NOW()`);
    
    // Add payment id to values array
    values.push(id);
    
    const result = await this.db.query(
      `UPDATE payments SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) return null;
    
    const payment = result.rows[0];
    return {
      ...payment,
      worker_id: payment.worker_id,
      project_id: payment.project_id,
      approved_by: payment.approved_by,
      approved_at: payment.approved_at,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      amount: parseFloat(payment.amount),
    };
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.db.query('DELETE FROM payments WHERE id = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      return false;
    }
  }

  async count(status?: string): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM payments';
    let params: any[] = [];
    
    if (status) {
      query = 'SELECT COUNT(*) as count FROM payments WHERE status = $1';
      params = [status];
    }
    
    const result = await this.db.query(query, params);
    return parseInt(result.rows[0].count);
  }

  async findByWorkerId(workerId: string, limit: number = 10, offset: number = 0): Promise<Payment[]> {
    const result = await this.db.query(
      'SELECT * FROM payments WHERE worker_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [workerId, limit, offset]
    );
    
    return result.rows.map((payment: any) => ({
      ...payment,
      worker_id: payment.worker_id,
      project_id: payment.project_id,
      approved_by: payment.approved_by,
      approved_at: payment.approved_at,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      amount: parseFloat(payment.amount),
    }));
  }

  async findByProjectId(projectId: string, limit: number = 10, offset: number = 0): Promise<Payment[]> {
    const result = await this.db.query(
      'SELECT * FROM payments WHERE project_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [projectId, limit, offset]
    );
    
    return result.rows.map((payment: any) => ({
      ...payment,
      worker_id: payment.worker_id,
      project_id: payment.project_id,
      approved_by: payment.approved_by,
      approved_at: payment.approved_at,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      amount: parseFloat(payment.amount),
    }));
  }

  async countByWorkerId(workerId: string): Promise<number> {
    const result = await this.db.query('SELECT COUNT(*) as count FROM payments WHERE worker_id = $1', [workerId]);
    return parseInt(result.rows[0].count);
  }

  async countByProjectId(projectId: string): Promise<number> {
    const result = await this.db.query('SELECT COUNT(*) as count FROM payments WHERE project_id = $1', [projectId]);
    return parseInt(result.rows[0].count);
  }
}