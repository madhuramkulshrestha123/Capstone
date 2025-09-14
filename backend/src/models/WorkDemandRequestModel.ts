import Database from '../config/database';
import { WorkDemandRequest, CreateWorkDemandRequest, UpdateWorkDemandRequest } from '../types';

export class WorkDemandRequestModel {
  private db: any;

  constructor() {
    const db = Database.getInstance();
    this.db = db.client;
  }

  async findAll(limit: number = 10, offset: number = 0, status?: string): Promise<WorkDemandRequest[]> {
    let query = 'SELECT * FROM work_demand_requests ORDER BY request_time DESC LIMIT $1 OFFSET $2';
    let params: any[] = [limit, offset];
    
    if (status) {
      query = 'SELECT * FROM work_demand_requests WHERE status = $3 ORDER BY request_time DESC LIMIT $1 OFFSET $2';
      params = [limit, offset, status];
    }

    const result = await this.db.query(query, params);
    
    return result.rows.map((request: any) => ({
      ...request,
      worker_id: request.worker_id,
      project_id: request.project_id,
      request_time: request.request_time,
      allocated_at: request.allocated_at,
    }));
  }

  async findById(id: string): Promise<WorkDemandRequest | null> {
    const result = await this.db.query('SELECT * FROM work_demand_requests WHERE id = $1', [id]);
    
    if (result.rows.length === 0) return null;
    
    const request = result.rows[0];
    return {
      ...request,
      worker_id: request.worker_id,
      project_id: request.project_id,
      request_time: request.request_time,
      allocated_at: request.allocated_at,
    };
  }

  async create(requestData: CreateWorkDemandRequest): Promise<WorkDemandRequest> {
    const result = await this.db.query(
      `INSERT INTO work_demand_requests (
        worker_id, project_id, request_time, status, allocated_at
      ) VALUES ($1, $2, NOW(), $3, $4) RETURNING *`,
      [
        requestData.worker_id,
        requestData.project_id,
        requestData.status || 'pending',
        requestData.allocated_at ? new Date(requestData.allocated_at) : null,
      ]
    );
    
    const request = result.rows[0];
    return {
      ...request,
      worker_id: request.worker_id,
      project_id: request.project_id,
      request_time: request.request_time,
      allocated_at: request.allocated_at,
    };
  }

  async update(id: string, requestData: UpdateWorkDemandRequest): Promise<WorkDemandRequest | null> {
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    // Build dynamic update query based on provided fields
    if (requestData.worker_id !== undefined) {
      updateFields.push(`worker_id = $${paramCount}`);
      values.push(requestData.worker_id);
      paramCount++;
    }
    
    if (requestData.project_id !== undefined) {
      updateFields.push(`project_id = $${paramCount}`);
      values.push(requestData.project_id);
      paramCount++;
    }
    
    if (requestData.status !== undefined) {
      updateFields.push(`status = $${paramCount}`);
      values.push(requestData.status);
      paramCount++;
    }
    
    if (requestData.allocated_at !== undefined) {
      updateFields.push(`allocated_at = $${paramCount}`);
      values.push(requestData.allocated_at ? new Date(requestData.allocated_at) : null);
      paramCount++;
    }
    
    // If no fields to update, return the existing request
    if (updateFields.length === 0) {
      return this.findById(id);
    }
    
    // Add request id to values array
    values.push(id);
    
    const result = await this.db.query(
      `UPDATE work_demand_requests SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) return null;
    
    const request = result.rows[0];
    return {
      ...request,
      worker_id: request.worker_id,
      project_id: request.project_id,
      request_time: request.request_time,
      allocated_at: request.allocated_at,
    };
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.db.query('DELETE FROM work_demand_requests WHERE id = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      return false;
    }
  }

  async count(status?: string): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM work_demand_requests';
    let params: any[] = [];
    
    if (status) {
      query = 'SELECT COUNT(*) as count FROM work_demand_requests WHERE status = $1';
      params = [status];
    }
    
    const result = await this.db.query(query, params);
    return parseInt(result.rows[0].count);
  }

  async findByWorkerId(workerId: string, limit: number = 10, offset: number = 0): Promise<WorkDemandRequest[]> {
    const result = await this.db.query(
      'SELECT * FROM work_demand_requests WHERE worker_id = $1 ORDER BY request_time DESC LIMIT $2 OFFSET $3',
      [workerId, limit, offset]
    );
    
    return result.rows.map((request: any) => ({
      ...request,
      worker_id: request.worker_id,
      project_id: request.project_id,
      request_time: request.request_time,
      allocated_at: request.allocated_at,
    }));
  }

  async findByProjectId(projectId: string, limit: number = 10, offset: number = 0): Promise<WorkDemandRequest[]> {
    const result = await this.db.query(
      'SELECT * FROM work_demand_requests WHERE project_id = $1 ORDER BY request_time DESC LIMIT $2 OFFSET $3',
      [projectId, limit, offset]
    );
    
    return result.rows.map((request: any) => ({
      ...request,
      worker_id: request.worker_id,
      project_id: request.project_id,
      request_time: request.request_time,
      allocated_at: request.allocated_at,
    }));
  }

  async countByWorkerId(workerId: string): Promise<number> {
    const result = await this.db.query('SELECT COUNT(*) as count FROM work_demand_requests WHERE worker_id = $1', [workerId]);
    return parseInt(result.rows[0].count);
  }

  async countByProjectId(projectId: string): Promise<number> {
    const result = await this.db.query('SELECT COUNT(*) as count FROM work_demand_requests WHERE project_id = $1', [projectId]);
    return parseInt(result.rows[0].count);
  }
}