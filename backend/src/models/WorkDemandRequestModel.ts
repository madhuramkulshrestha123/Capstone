import Database from '../config/database';
import { PrismaClient } from '@prisma/client';
import { WorkDemandRequest, CreateWorkDemandRequest, UpdateWorkDemandRequest } from '../types';

// Define the Prisma work demand request type based on the database schema
interface PrismaWorkDemandRequest {
  id: string;
  workerId: number;
  projectId: string;
  requestTime: Date;
  status: string;
  allocatedAt: Date | null;
}

export class WorkDemandRequestModel {
  private prisma: PrismaClient;

  constructor() {
    const db = Database.getInstance();
    this.prisma = db.client;
  }

  async findAll(limit: number = 10, offset: number = 0, status?: string): Promise<WorkDemandRequest[]> {
    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    const requests = await (this.prisma as any).workDemandRequest.findMany({
      where: whereClause,
      orderBy: {
        requestTime: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return requests.map((request: PrismaWorkDemandRequest) => ({
      ...request,
      worker_id: request.workerId,
      project_id: request.projectId,
      request_time: request.requestTime,
      allocated_at: request.allocatedAt,
    })) as WorkDemandRequest[];
  }

  async findById(id: string): Promise<WorkDemandRequest | null> {
    const request = await (this.prisma as any).workDemandRequest.findUnique({
      where: {
        id,
      },
    });

    if (!request) return null;

    return {
      ...request,
      worker_id: request.workerId,
      project_id: request.projectId,
      request_time: request.requestTime,
      allocated_at: request.allocatedAt,
    } as WorkDemandRequest;
  }

  async create(requestData: CreateWorkDemandRequest): Promise<WorkDemandRequest> {
    const request = await (this.prisma as any).workDemandRequest.create({
      data: {
        workerId: requestData.worker_id,
        projectId: requestData.project_id,
        status: requestData.status || 'pending',
        allocatedAt: requestData.allocated_at ? new Date(requestData.allocated_at) : null,
      },
    });

    return {
      ...request,
      worker_id: request.workerId,
      project_id: request.projectId,
      request_time: request.requestTime,
      allocated_at: request.allocatedAt,
    } as WorkDemandRequest;
  }

  async update(id: string, requestData: UpdateWorkDemandRequest): Promise<WorkDemandRequest | null> {
    const updateData: any = {};

    if (requestData.worker_id !== undefined) updateData.workerId = requestData.worker_id;
    if (requestData.project_id !== undefined) updateData.projectId = requestData.project_id;
    if (requestData.status !== undefined) updateData.status = requestData.status;
    if (requestData.allocated_at !== undefined) updateData.allocatedAt = requestData.allocated_at ? new Date(requestData.allocated_at) : null;

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    try {
      const request = await (this.prisma as any).workDemandRequest.update({
        where: {
          id,
        },
        data: updateData,
      });

      return {
        ...request,
        worker_id: request.workerId,
        project_id: request.projectId,
        request_time: request.requestTime,
        allocated_at: request.allocatedAt,
      } as WorkDemandRequest;
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await (this.prisma as any).workDemandRequest.delete({
        where: {
          id,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async count(status?: string): Promise<number> {
    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    return await (this.prisma as any).workDemandRequest.count({
      where: whereClause,
    });
  }

  async findByWorkerId(workerId: number, limit: number = 10, offset: number = 0): Promise<WorkDemandRequest[]> {
    const requests = await (this.prisma as any).workDemandRequest.findMany({
      where: {
        workerId,
      },
      orderBy: {
        requestTime: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return requests.map((request: PrismaWorkDemandRequest) => ({
      ...request,
      worker_id: request.workerId,
      project_id: request.projectId,
      request_time: request.requestTime,
      allocated_at: request.allocatedAt,
    })) as WorkDemandRequest[];
  }

  async findByProjectId(projectId: string, limit: number = 10, offset: number = 0): Promise<WorkDemandRequest[]> {
    const requests = await (this.prisma as any).workDemandRequest.findMany({
      where: {
        projectId,
      },
      orderBy: {
        requestTime: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return requests.map((request: PrismaWorkDemandRequest) => ({
      ...request,
      worker_id: request.workerId,
      project_id: request.projectId,
      request_time: request.requestTime,
      allocated_at: request.allocatedAt,
    })) as WorkDemandRequest[];
  }

  async countByWorkerId(workerId: number): Promise<number> {
    return await (this.prisma as any).workDemandRequest.count({
      where: {
        workerId,
      },
    });
  }

  async countByProjectId(projectId: string): Promise<number> {
    return await (this.prisma as any).workDemandRequest.count({
      where: {
        projectId,
      },
    });
  }
}