﻿﻿import { ProjectModel } from '../models/ProjectModel';
import { WorkDemandRequestModel } from '../models/WorkDemandRequestModel';
import { UserModel } from '../models/UserModel';
import { JobCardModel } from '../models/JobCardModel';
import { JobCardApplicationModel } from '../models/JobCardApplicationModel';
import { AppError } from '../middlewares/errorMiddleware';
import { CreateProjectRequest, UpdateProjectRequest, Project } from '../types';

export class ProjectService {
  private projectModel: ProjectModel;
  private workDemandRequestModel: WorkDemandRequestModel;
  private userModel: UserModel;
  private jobCardModel: JobCardModel;
  private jobCardApplicationModel: JobCardApplicationModel;

  constructor() {
    this.projectModel = new ProjectModel();
    this.workDemandRequestModel = new WorkDemandRequestModel();
    this.userModel = new UserModel();
    this.jobCardModel = new JobCardModel();
    this.jobCardApplicationModel = new JobCardApplicationModel();
  }

  async getAllProjects(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{
    projects: Project[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      this.projectModel.findAll(limit, offset, status),
      this.projectModel.count(status),
    ]);

    // Add assigned workers count to each project
    const projectsWithAssignedWorkers = await Promise.all(
      projects.map(async (project) => {
        const assignedWorkersCount = await this.workDemandRequestModel.countByProjectId(project.id);
        return {
          ...project,
          assigned_workers: assignedWorkersCount
        } as Project;
      })
    );

    return {
      projects: projectsWithAssignedWorkers,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    
    // Add assigned workers count
    const assignedWorkersCount = await this.workDemandRequestModel.countByProjectId(project.id);
    return {
      ...project,
      assigned_workers: assignedWorkersCount
    } as Project;
  }

  async createProject(projectData: CreateProjectRequest, userId: string): Promise<Project> {
    // Validate project data
    const startDate = new Date(projectData.start_date);
    const endDate = new Date(projectData.end_date);
    
    if (startDate >= endDate) {
      throw new AppError('End date must be after start date', 400);
    }

    if (projectData.worker_need <= 0) {
      throw new AppError('Worker need must be greater than 0', 400);
    }

    // Validate wage_per_worker (minimum Rs. 374 per manday)
    if (projectData.wage_per_worker !== undefined && projectData.wage_per_worker < 374) {
      throw new AppError('Wage per worker must be at least Rs. 374 per manday', 400);
    }

    const project = await this.projectModel.create(projectData, userId);
    return project;
  }

  async updateProject(id: string, projectData: UpdateProjectRequest): Promise<Project> {
    // Check if project exists
    const existingProject = await this.projectModel.findById(id);
    if (!existingProject) {
      throw new AppError('Project not found', 404);
    }

    // Validate updated data if provided
    if (projectData.start_date !== undefined && projectData.end_date !== undefined) {
      const startDate = new Date(projectData.start_date);
      const endDate = new Date(projectData.end_date);
      
      if (startDate >= endDate) {
        throw new AppError('End date must be after start date', 400);
      }
    }

    if (projectData.worker_need !== undefined && projectData.worker_need <= 0) {
      throw new AppError('Worker need must be greater than 0', 400);
    }

    // Validate wage_per_worker (minimum Rs. 374 per manday)
    if (projectData.wage_per_worker !== undefined && projectData.wage_per_worker < 374) {
      throw new AppError('Wage per worker must be at least Rs. 374 per manday', 400);
    }

    const updatedProject = await this.projectModel.update(id, projectData);
    if (!updatedProject) {
      throw new AppError('Failed to update project', 500);
    }

    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const deleted = await this.projectModel.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete project', 500);
    }
  }

  async getProjectsByUserId(userId: string, page: number = 1, limit: number = 10): Promise<{
    projects: Project[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      this.projectModel.findByUserId(userId, limit, offset),
      this.projectModel.countByUserId(userId),
    ]);

    // Add assigned workers count to each project
    const projectsWithAssignedWorkers = await Promise.all(
      projects.map(async (project) => {
        const assignedWorkersCount = await this.workDemandRequestModel.countByProjectId(project.id);
        return {
          ...project,
          assigned_workers: assignedWorkersCount
        } as Project;
      })
    );

    return {
      projects: projectsWithAssignedWorkers,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProjectsByStatus(status: string, page: number = 1, limit: number = 10): Promise<{
    projects: Project[];
    total: number;
    totalPages: number;
  }> {
    return this.getAllProjects(page, limit, status);
  }

  async assignWorkersToProject(projectId: string, workerIds: string[]): Promise<{ message: string }> {
    // Check if project exists
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Validate that all worker IDs are valid and have approved job cards
    for (const workerId of workerIds) {
      const worker = await this.userModel.findById(workerId);
      if (!worker) {
        throw new AppError(`Worker with ID ${workerId} not found`, 404);
      }
      
      // Check if worker has an approved job card
      // In a real implementation, you would check if the worker's job card is approved
      // For now, we'll assume all workers are valid
    }

    // Create work demand requests for each worker
    for (const workerId of workerIds) {
      await this.workDemandRequestModel.create({
        worker_id: workerId, // Keep as string, don't convert to number
        project_id: projectId,
        status: 'approved', // Automatically approve since admin is assigning
        allocated_at: new Date().toISOString()
      });
    }

    return {
      message: `${workerIds.length} workers assigned to project successfully`
    };
  }

  async getAvailableWorkers(): Promise<any[]> {
    try {
      // Get all users with role 'supervisor' (workers in this system)
      const users = await this.userModel.getUsersByRole('supervisor');
      
      // Filter for workers with approved job cards
      const availableWorkers = [];
      
      for (const user of users) {
        // Check if user has an approved job card application
        const application = await this.jobCardApplicationModel.findByAadhaarNumber(user.aadhaar_number);
        
        if (application && application.status === 'approved') {
          availableWorkers.push({
            user_id: user.user_id,
            name: user.name,
            aadhaar_number: user.aadhaar_number,
            district: user.district,
            panchayat_id: user.panchayat_id,
            job_card_id: application.job_card_id
          });
        }
      }
      
      return availableWorkers;
    } catch (error) {
      throw new AppError('Failed to fetch available workers', 500);
    }
  }
  
  async getAssignedWorkersByProjectId(projectId: string): Promise<any[]> {
    try {
      // Get work demand requests for this project
      const workRequests = await this.workDemandRequestModel.findByProjectId(projectId);
      
      // Map to worker details
      const assignedWorkers = workRequests.map((request: any) => ({
        id: request.worker_id,
        name: request.worker_name,
        aadhaar_number: request.worker_aadhaar,
        assigned_date: request.allocated_at,
        status: request.status
      }));
      
      return assignedWorkers;
    } catch (error) {
      throw new AppError('Failed to fetch assigned workers', 500);
    }
  }
}