import Database from '../config/database';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../types';

export class ProjectModel {
  private db: any;

  constructor() {
    const db = Database.getInstance();
    this.db = db.client;
  }

  async findAll(limit: number = 10, offset: number = 0, status?: string): Promise<Project[]> {
    let query = 'SELECT * FROM projects ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    let params: any[] = [limit, offset];
    
    if (status) {
      query = 'SELECT * FROM projects WHERE status = $3 ORDER BY created_at DESC LIMIT $1 OFFSET $2';
      params = [limit, offset, status];
    }

    const result = await this.db.query(query, params);
    
    return result.rows.map((project: any) => ({
      ...project,
      worker_need: project.worker_need,
      start_date: project.start_date,
      end_date: project.end_date,
      created_by: project.created_by,
      created_at: project.created_at,
      updated_at: project.updated_at,
    }));
  }

  async findById(id: string): Promise<Project | null> {
    const result = await this.db.query('SELECT * FROM projects WHERE id = $1', [id]);
    
    if (result.rows.length === 0) return null;
    
    const project = result.rows[0];
    return {
      ...project,
      worker_need: project.worker_need,
      start_date: project.start_date,
      end_date: project.end_date,
      created_by: project.created_by,
      created_at: project.created_at,
      updated_at: project.updated_at,
    };
  }

  async create(projectData: CreateProjectRequest, userId: string): Promise<Project> {
    const result = await this.db.query(
      `INSERT INTO projects (
        name, description, location, worker_need, start_date, end_date, status, created_by, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *`,
      [
        projectData.name,
        projectData.description || null,
        projectData.location || null,
        projectData.worker_need,
        new Date(projectData.start_date),
        new Date(projectData.end_date),
        projectData.status || 'pending',
        userId,
      ]
    );
    
    const project = result.rows[0];
    return {
      ...project,
      worker_need: project.worker_need,
      start_date: project.start_date,
      end_date: project.end_date,
      created_by: project.created_by,
      created_at: project.created_at,
      updated_at: project.updated_at,
    };
  }

  async update(id: string, projectData: UpdateProjectRequest): Promise<Project | null> {
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    // Build dynamic update query based on provided fields
    if (projectData.name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      values.push(projectData.name);
      paramCount++;
    }
    
    if (projectData.description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(projectData.description);
      paramCount++;
    }
    
    if (projectData.location !== undefined) {
      updateFields.push(`location = $${paramCount}`);
      values.push(projectData.location);
      paramCount++;
    }
    
    if (projectData.worker_need !== undefined) {
      updateFields.push(`worker_need = $${paramCount}`);
      values.push(projectData.worker_need);
      paramCount++;
    }
    
    if (projectData.start_date !== undefined) {
      updateFields.push(`start_date = $${paramCount}`);
      values.push(new Date(projectData.start_date));
      paramCount++;
    }
    
    if (projectData.end_date !== undefined) {
      updateFields.push(`end_date = $${paramCount}`);
      values.push(new Date(projectData.end_date));
      paramCount++;
    }
    
    if (projectData.status !== undefined) {
      updateFields.push(`status = $${paramCount}`);
      values.push(projectData.status);
      paramCount++;
    }
    
    // If no fields to update, return the existing project
    if (updateFields.length === 0) {
      return this.findById(id);
    }
    
    // Add updated_at timestamp
    updateFields.push(`updated_at = NOW()`);
    
    // Add project id to values array
    values.push(id);
    
    const result = await this.db.query(
      `UPDATE projects SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) return null;
    
    const project = result.rows[0];
    return {
      ...project,
      worker_need: project.worker_need,
      start_date: project.start_date,
      end_date: project.end_date,
      created_by: project.created_by,
      created_at: project.created_at,
      updated_at: project.updated_at,
    };
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.db.query('DELETE FROM projects WHERE id = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      return false;
    }
  }

  async count(status?: string): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM projects';
    let params: any[] = [];
    
    if (status) {
      query = 'SELECT COUNT(*) as count FROM projects WHERE status = $1';
      params = [status];
    }
    
    const result = await this.db.query(query, params);
    return parseInt(result.rows[0].count);
  }

  async findByUserId(userId: string, limit: number = 10, offset: number = 0): Promise<Project[]> {
    const result = await this.db.query(
      'SELECT * FROM projects WHERE created_by = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    
    return result.rows.map((project: any) => ({
      ...project,
      worker_need: project.worker_need,
      start_date: project.start_date,
      end_date: project.end_date,
      created_by: project.created_by,
      created_at: project.created_at,
      updated_at: project.updated_at,
    }));
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await this.db.query('SELECT COUNT(*) as count FROM projects WHERE created_by = $1', [userId]);
    return parseInt(result.rows[0].count);
  }
}