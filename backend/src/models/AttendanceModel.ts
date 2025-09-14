import Database from '../config/database';
import { Attendance, CreateAttendanceRequest, UpdateAttendanceRequest } from '../types';

export class AttendanceModel {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findAll(limit: number = 10, offset: number = 0, projectId?: string): Promise<Attendance[]> {
    let query = 'SELECT * FROM attendance';
    const params: any[] = [];
    
    if (projectId) {
      query += ' WHERE project_id = $1';
      params.push(projectId);
    }
    
    query += ' ORDER BY date DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await this.db.query(query, params);
    return result.rows;
  }

  async findById(id: string): Promise<Attendance | null> {
    const result = await this.db.query('SELECT * FROM attendance WHERE id = $1', [id]);
    
    if (result.rows.length === 0) return null;
    
    return result.rows[0];
  }

  async create(attendanceData: CreateAttendanceRequest, supervisorId: string): Promise<Attendance> {
    // Check if attendance already exists for this worker on this date
    const existingResult = await this.db.query(
      'SELECT * FROM attendance WHERE worker_id = $1 AND project_id = $2 AND date = $3',
      [attendanceData.worker_id, attendanceData.project_id, new Date(attendanceData.date)]
    );

    if (existingResult.rows.length > 0) {
      throw new Error('Attendance already marked for this worker on this date');
    }

    const result = await this.db.query(
      'INSERT INTO attendance (worker_id, project_id, date, status, marked_by, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [
        attendanceData.worker_id,
        attendanceData.project_id,
        new Date(attendanceData.date),
        attendanceData.status,
        supervisorId
      ]
    );

    return result.rows[0];
  }

  async update(id: string, attendanceData: UpdateAttendanceRequest): Promise<Attendance | null> {
    // If no data to update, just return the current record
    if (attendanceData.status === undefined) {
      return this.findById(id);
    }

    try {
      const result = await this.db.query(
        'UPDATE attendance SET status = $1 WHERE id = $2 RETURNING *',
        [attendanceData.status, id]
      );

      if (result.rows.length === 0) return null;
       
      return result.rows[0];
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.db.query('DELETE FROM attendance WHERE id = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      return false;
    }
  }

  async count(projectId?: string): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM attendance';
    const params: any[] = [];

    if (projectId) {
      query += ' WHERE project_id = $1';
      params.push(projectId);
    }

    const result = await this.db.query(query, params);
    return parseInt(result.rows[0].count);
  }

  async findByWorkerId(workerId: string, limit: number = 10, offset: number = 0): Promise<Attendance[]> {
    const result = await this.db.query(
      'SELECT * FROM attendance WHERE worker_id = $1 ORDER BY date DESC LIMIT $2 OFFSET $3',
      [workerId, limit, offset]
    );
    
    return result.rows;
  }

  async findByProjectId(projectId: string, limit: number = 10, offset: number = 0): Promise<Attendance[]> {
    const result = await this.db.query(
      'SELECT * FROM attendance WHERE project_id = $1 ORDER BY date DESC LIMIT $2 OFFSET $3',
      [projectId, limit, offset]
    );
    
    return result.rows;
  }

  async findByDateRange(projectId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    const result = await this.db.query(
      'SELECT * FROM attendance WHERE project_id = $1 AND date >= $2 AND date <= $3 ORDER BY date ASC',
      [projectId, startDate, endDate]
    );
    
    return result.rows;
  }

  async countByWorkerId(workerId: string): Promise<number> {
    const result = await this.db.query(
      'SELECT COUNT(*) as count FROM attendance WHERE worker_id = $1',
      [workerId]
    );
    
    return parseInt(result.rows[0].count);
  }

  async countByProjectId(projectId: string): Promise<number> {
    const result = await this.db.query(
      'SELECT COUNT(*) as count FROM attendance WHERE project_id = $1',
      [projectId]
    );
    
    return parseInt(result.rows[0].count);
  }
}