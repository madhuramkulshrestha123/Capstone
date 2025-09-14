import { WorkDemandRequestModel } from '../models/WorkDemandRequestModel';
import { AppError } from '../middlewares/errorMiddleware';
import { CreateWorkDemandRequest, UpdateWorkDemandRequest, WorkDemandRequest } from '../types';

export class WorkDemandRequestService {
  private workDemandRequestModel: WorkDemandRequestModel;

  constructor() {
    this.workDemandRequestModel = new WorkDemandRequestModel();
  }

  async getAllRequests(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{
    requests: WorkDemandRequest[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [requests, total] = await Promise.all([
      this.workDemandRequestModel.findAll(limit, offset, status),
      this.workDemandRequestModel.count(status),
    ]);

    return {
      requests,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRequestById(id: string): Promise<WorkDemandRequest> {
    const request = await this.workDemandRequestModel.findById(id);
    if (!request) {
      throw new AppError('Work demand request not found', 404);
    }
    return request;
  }

  async createRequest(requestData: CreateWorkDemandRequest): Promise<WorkDemandRequest> {
    // Validate that worker and project exist
    // Note: In a real implementation, you would check if the worker and project exist in the database
    
    const request = await this.workDemandRequestModel.create(requestData);
    return request;
  }

  async updateRequest(id: string, requestData: UpdateWorkDemandRequest): Promise<WorkDemandRequest> {
    // Check if request exists
    const existingRequest = await this.workDemandRequestModel.findById(id);
    if (!existingRequest) {
      throw new AppError('Work demand request not found', 404);
    }

    const updatedRequest = await this.workDemandRequestModel.update(id, requestData);
    if (!updatedRequest) {
      throw new AppError('Failed to update work demand request', 500);
    }

    return updatedRequest;
  }

  async deleteRequest(id: string): Promise<void> {
    const request = await this.workDemandRequestModel.findById(id);
    if (!request) {
      throw new AppError('Work demand request not found', 404);
    }

    const deleted = await this.workDemandRequestModel.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete work demand request', 500);
    }
  }

  async getRequestsByWorkerId(workerId: string, page: number = 1, limit: number = 10): Promise<{
    requests: WorkDemandRequest[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [requests, total] = await Promise.all([
      this.workDemandRequestModel.findByWorkerId(workerId, limit, offset),
      this.workDemandRequestModel.countByWorkerId(workerId),
    ]);

    return {
      requests,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRequestsByProjectId(projectId: string, page: number = 1, limit: number = 10): Promise<{
    requests: WorkDemandRequest[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [requests, total] = await Promise.all([
      this.workDemandRequestModel.findByProjectId(projectId, limit, offset),
      this.workDemandRequestModel.countByProjectId(projectId),
    ]);

    return {
      requests,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveRequest(id: string, allocatedAt?: string): Promise<WorkDemandRequest> {
    const requestData: UpdateWorkDemandRequest = {
      status: 'approved',
      allocated_at: allocatedAt || new Date().toISOString(),
    };

    return this.updateRequest(id, requestData);
  }

  async rejectRequest(id: string): Promise<WorkDemandRequest> {
    const requestData: UpdateWorkDemandRequest = {
      status: 'rejected',
    };

    return this.updateRequest(id, requestData);
  }
}