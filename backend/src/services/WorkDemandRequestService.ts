import { WorkDemandRequestModel } from '../models/WorkDemandRequestModel';
import { ProjectModel } from '../models/ProjectModel';
import { AppError } from '../middlewares/errorMiddleware';
import { CreateWorkDemandRequest, UpdateWorkDemandRequest, WorkDemandRequest } from '../types';

export class WorkDemandRequestService {
  private workDemandRequestModel: WorkDemandRequestModel;
  private projectModel: ProjectModel;

  constructor() {
    this.workDemandRequestModel = new WorkDemandRequestModel();
    this.projectModel = new ProjectModel();
  }

  async createRequest(requestData: CreateWorkDemandRequest): Promise<WorkDemandRequest> {
    // Validate that worker exists (in a real implementation)
    // For now, we'll assume the worker_id is valid
    
    return this.workDemandRequestModel.create(requestData);
  }

  async getRequests(page: number = 1, limit: number = 10, status?: string): Promise<{
    requests: WorkDemandRequest[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [requests, total] = await Promise.all([
      this.workDemandRequestModel.findAll(limit, offset, status),
      this.workDemandRequestModel.count(status)
    ]);

    return {
      requests,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRequestsByWorkerId(workerId: string, page: number = 1, limit: number = 10, status?: string): Promise<{
    requests: WorkDemandRequest[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [requests, total] = await Promise.all([
      this.workDemandRequestModel.findByWorkerId(workerId, limit, offset),
      this.workDemandRequestModel.countByWorkerId(workerId)
    ]);

    return {
      requests,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRequestsByProjectId(projectId: string, page: number = 1, limit: number = 10, status?: string): Promise<{
    requests: WorkDemandRequest[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [requests, total] = await Promise.all([
      this.workDemandRequestModel.findByProjectId(projectId, limit, offset),
      this.workDemandRequestModel.countByProjectId(projectId)
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

  async updateRequest(id: string, requestData: UpdateWorkDemandRequest): Promise<WorkDemandRequest> {
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

  async getAllRequests(): Promise<WorkDemandRequest[]> {
    // Get all work demand requests
    const requests = await this.workDemandRequestModel.findAll(1000, 0);
    return requests;
  }

  async approveRequest(id: string, allocatedAt?: string, projectId?: string): Promise<WorkDemandRequest> {
    // First, get the current request to check if it already has a project
    const currentRequest = await this.getRequestById(id);
    
    // If a project ID is provided, update the request with it
    if (projectId) {
      const updateData: UpdateWorkDemandRequest = {
        status: 'approved',
        allocated_at: allocatedAt || new Date().toISOString(),
        project_id: projectId
      };
      
      return this.updateRequest(id, updateData);
    }
    
    // If the request already has a project, proceed with approval
    if (currentRequest.project_id) {
      const requestData: UpdateWorkDemandRequest = {
        status: 'approved',
        allocated_at: allocatedAt || new Date().toISOString(),
      };
      
      return this.updateRequest(id, requestData);
    }
    
    // If no project is assigned, we need to check if worker requirements are fulfilled
    // For now, we'll just approve the request without a project
    // In a real implementation, you might want to check project worker requirements here
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