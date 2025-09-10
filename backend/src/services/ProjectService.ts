import { ProjectModel } from '../models/ProjectModel';
import { AppError } from '../middlewares/errorMiddleware';
import { CreateProjectRequest, UpdateProjectRequest, Project } from '../types';

export class ProjectService {
  private projectModel: ProjectModel;

  constructor() {
    this.projectModel = new ProjectModel();
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

    return {
      projects,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    return project;
  }

  async createProject(projectData: CreateProjectRequest, userId: number): Promise<Project> {
    // Validate project data
    const startDate = new Date(projectData.start_date);
    const endDate = new Date(projectData.end_date);
    
    if (startDate >= endDate) {
      throw new AppError('End date must be after start date', 400);
    }

    if (projectData.worker_need <= 0) {
      throw new AppError('Worker need must be greater than 0', 400);
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

  async getProjectsByUserId(userId: number, page: number = 1, limit: number = 10): Promise<{
    projects: Project[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      this.projectModel.findByUserId(userId, limit, offset),
      this.projectModel.countByUserId(userId),
    ]);

    return {
      projects,
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
}