import { AttendanceModel } from '../models/AttendanceModel';
import { AppError } from '../middlewares/errorMiddleware';
import { CreateAttendanceRequest, UpdateAttendanceRequest, Attendance } from '../types';

export class AttendanceService {
  private attendanceModel: AttendanceModel;

  constructor() {
    this.attendanceModel = new AttendanceModel();
  }

  async getAllAttendances(
    page: number = 1,
    limit: number = 10,
    projectId?: string
  ): Promise<{
    attendances: Attendance[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [attendances, total] = await Promise.all([
      this.attendanceModel.findAll(limit, offset, projectId),
      this.attendanceModel.count(projectId),
    ]);

    return {
      attendances,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAttendanceById(id: string): Promise<Attendance> {
    const attendance = await this.attendanceModel.findById(id);
    if (!attendance) {
      throw new AppError('Attendance record not found', 404);
    }
    return attendance;
  }

  async markAttendance(attendanceData: CreateAttendanceRequest, supervisorId: string): Promise<Attendance> {
    // Validate that the supervisor has the right role
    // Note: In a real implementation, you would check the user's role in the database
    
    // Validate that the date is not in the future
    const attendanceDate = new Date(attendanceData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (attendanceDate > today) {
      throw new AppError('Cannot mark attendance for future dates', 400);
    }

    try {
      const attendance = await this.attendanceModel.create(attendanceData, supervisorId);
      return attendance;
    } catch (error: any) {
      if (error.message === 'Attendance already marked for this worker on this date') {
        throw new AppError(error.message, 400);
      }
      throw new AppError('Failed to mark attendance', 500);
    }
  }

  async updateAttendance(id: string, attendanceData: UpdateAttendanceRequest): Promise<Attendance> {
    // Check if attendance exists
    const existingAttendance = await this.attendanceModel.findById(id);
    if (!existingAttendance) {
      throw new AppError('Attendance record not found', 404);
    }

    const updatedAttendance = await this.attendanceModel.update(id, attendanceData);
    if (!updatedAttendance) {
      throw new AppError('Failed to update attendance', 500);
    }

    return updatedAttendance;
  }

  async deleteAttendance(id: string): Promise<void> {
    const attendance = await this.attendanceModel.findById(id);
    if (!attendance) {
      throw new AppError('Attendance record not found', 404);
    }

    const deleted = await this.attendanceModel.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete attendance', 500);
    }
  }

  async getAttendancesByWorkerId(workerId: string, page: number = 1, limit: number = 10): Promise<{
    attendances: Attendance[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [attendances, total] = await Promise.all([
      this.attendanceModel.findByWorkerId(workerId, limit, offset),
      this.attendanceModel.countByWorkerId(workerId),
    ]);

    return {
      attendances,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAttendancesByProjectId(projectId: string, page: number = 1, limit: number = 10): Promise<{
    attendances: Attendance[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [attendances, total] = await Promise.all([
      this.attendanceModel.findByProjectId(projectId, limit, offset),
      this.attendanceModel.countByProjectId(projectId),
    ]);

    return {
      attendances,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAttendancesByDateRange(projectId: string, startDate: string, endDate: string): Promise<Attendance[]> {
    const attendances = await this.attendanceModel.findByDateRange(
      projectId,
      new Date(startDate),
      new Date(endDate)
    );
    
    return attendances;
  }
}