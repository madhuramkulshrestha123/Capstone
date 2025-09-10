import Database from '../config/database';
import { PrismaClient } from '@prisma/client';
import { Attendance, CreateAttendanceRequest, UpdateAttendanceRequest } from '../types';

// Define the Prisma attendance type based on the database schema
interface PrismaAttendance {
  id: string;
  workerId: number;
  projectId: string;
  date: Date;
  status: string;
  markedBy: number;
  createdAt: Date;
}

export class AttendanceModel {
  private prisma: PrismaClient;

  constructor() {
    const db = Database.getInstance();
    this.prisma = db.client;
  }

  async findAll(limit: number = 10, offset: number = 0, projectId?: string): Promise<Attendance[]> {
    const whereClause: any = {};

    if (projectId) {
      whereClause.projectId = projectId;
    }

    const attendances = await (this.prisma as any).attendance.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return attendances.map((attendance: PrismaAttendance) => ({
      ...attendance,
      worker_id: attendance.workerId,
      project_id: attendance.projectId,
      marked_by: attendance.markedBy,
      created_at: attendance.createdAt,
    })) as Attendance[];
  }

  async findById(id: string): Promise<Attendance | null> {
    const attendance = await (this.prisma as any).attendance.findUnique({
      where: {
        id,
      },
    });

    if (!attendance) return null;

    return {
      ...attendance,
      worker_id: attendance.workerId,
      project_id: attendance.projectId,
      marked_by: attendance.markedBy,
      created_at: attendance.createdAt,
    } as Attendance;
  }

  async create(attendanceData: CreateAttendanceRequest, supervisorId: number): Promise<Attendance> {
    // Check if attendance already exists for this worker on this date
    const existingAttendance = await (this.prisma as any).attendance.findFirst({
      where: {
        workerId: attendanceData.worker_id,
        projectId: attendanceData.project_id,
        date: new Date(attendanceData.date),
      },
    });

    if (existingAttendance) {
      throw new Error('Attendance already marked for this worker on this date');
    }

    const attendance = await (this.prisma as any).attendance.create({
      data: {
        workerId: attendanceData.worker_id,
        projectId: attendanceData.project_id,
        date: new Date(attendanceData.date),
        status: attendanceData.status,
        markedBy: supervisorId,
      },
    });

    return {
      ...attendance,
      worker_id: attendance.workerId,
      project_id: attendance.projectId,
      marked_by: attendance.markedBy,
      created_at: attendance.createdAt,
    } as Attendance;
  }

  async update(id: string, attendanceData: UpdateAttendanceRequest): Promise<Attendance | null> {
    const updateData: any = {};

    if (attendanceData.status !== undefined) updateData.status = attendanceData.status;

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    try {
      const attendance = await (this.prisma as any).attendance.update({
        where: {
          id,
        },
        data: updateData,
      });

      return {
        ...attendance,
        worker_id: attendance.workerId,
        project_id: attendance.projectId,
        marked_by: attendance.markedBy,
        created_at: attendance.createdAt,
      } as Attendance;
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await (this.prisma as any).attendance.delete({
        where: {
          id,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async count(projectId?: string): Promise<number> {
    const whereClause: any = {};

    if (projectId) {
      whereClause.projectId = projectId;
    }

    return await (this.prisma as any).attendance.count({
      where: whereClause,
    });
  }

  async findByWorkerId(workerId: number, limit: number = 10, offset: number = 0): Promise<Attendance[]> {
    const attendances = await (this.prisma as any).attendance.findMany({
      where: {
        workerId,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return attendances.map((attendance: PrismaAttendance) => ({
      ...attendance,
      worker_id: attendance.workerId,
      project_id: attendance.projectId,
      marked_by: attendance.markedBy,
      created_at: attendance.createdAt,
    })) as Attendance[];
  }

  async findByProjectId(projectId: string, limit: number = 10, offset: number = 0): Promise<Attendance[]> {
    const attendances = await (this.prisma as any).attendance.findMany({
      where: {
        projectId,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return attendances.map((attendance: PrismaAttendance) => ({
      ...attendance,
      worker_id: attendance.workerId,
      project_id: attendance.projectId,
      marked_by: attendance.markedBy,
      created_at: attendance.createdAt,
    })) as Attendance[];
  }

  async findByDateRange(projectId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    const attendances = await (this.prisma as any).attendance.findMany({
      where: {
        projectId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return attendances.map((attendance: PrismaAttendance) => ({
      ...attendance,
      worker_id: attendance.workerId,
      project_id: attendance.projectId,
      marked_by: attendance.markedBy,
      created_at: attendance.createdAt,
    })) as Attendance[];
  }

  async countByWorkerId(workerId: number): Promise<number> {
    return await (this.prisma as any).attendance.count({
      where: {
        workerId,
      },
    });
  }

  async countByProjectId(projectId: string): Promise<number> {
    return await (this.prisma as any).attendance.count({
      where: {
        projectId,
      },
    });
  }
}