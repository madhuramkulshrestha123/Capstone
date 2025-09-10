import Database from '../config/database';
import { PrismaClient } from '@prisma/client';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../types';

// Define the Prisma project type based on the database schema
interface PrismaProject {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  workerNeed: number;
  startDate: Date;
  endDate: Date;
  status: string;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectModel {
  private prisma: PrismaClient;

  constructor() {
    const db = Database.getInstance();
    this.prisma = db.client;
  }

  async findAll(limit: number = 10, offset: number = 0, status?: string): Promise<Project[]> {
    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    const projects = await (this.prisma as any).project.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return projects.map((project: PrismaProject) => ({
      ...project,
      worker_need: project.workerNeed,
      start_date: project.startDate,
      end_date: project.endDate,
      created_by: project.createdBy,
      created_at: project.createdAt,
      updated_at: project.updatedAt,
    })) as Project[];
  }

  async findById(id: string): Promise<Project | null> {
    const project = await (this.prisma as any).project.findUnique({
      where: {
        id,
      },
    });

    if (!project) return null;

    return {
      ...project,
      worker_need: project.workerNeed,
      start_date: project.startDate,
      end_date: project.endDate,
      created_by: project.createdBy,
      created_at: project.createdAt,
      updated_at: project.updatedAt,
    } as Project;
  }

  async create(projectData: CreateProjectRequest, userId: number): Promise<Project> {
    const project = await (this.prisma as any).project.create({
      data: {
        name: projectData.name,
        description: projectData.description || null,
        location: projectData.location || null,
        workerNeed: projectData.worker_need,
        startDate: new Date(projectData.start_date),
        endDate: new Date(projectData.end_date),
        status: projectData.status || 'pending',
        createdBy: userId,
      },
    });

    return {
      ...project,
      worker_need: project.workerNeed,
      start_date: project.startDate,
      end_date: project.endDate,
      created_by: project.createdBy,
      created_at: project.createdAt,
      updated_at: project.updatedAt,
    } as Project;
  }

  async update(id: string, projectData: UpdateProjectRequest): Promise<Project | null> {
    const updateData: any = {};

    if (projectData.name !== undefined) updateData.name = projectData.name;
    if (projectData.description !== undefined) updateData.description = projectData.description;
    if (projectData.location !== undefined) updateData.location = projectData.location;
    if (projectData.worker_need !== undefined) updateData.workerNeed = projectData.worker_need;
    if (projectData.start_date !== undefined) updateData.startDate = new Date(projectData.start_date);
    if (projectData.end_date !== undefined) updateData.endDate = new Date(projectData.end_date);
    if (projectData.status !== undefined) updateData.status = projectData.status;

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    try {
      const project = await (this.prisma as any).project.update({
        where: {
          id,
        },
        data: updateData,
      });

      return {
        ...project,
        worker_need: project.workerNeed,
        start_date: project.startDate,
        end_date: project.endDate,
        created_by: project.createdBy,
        created_at: project.createdAt,
        updated_at: project.updatedAt,
      } as Project;
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await (this.prisma as any).project.delete({
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

    return await (this.prisma as any).project.count({
      where: whereClause,
    });
  }

  async findByUserId(userId: number, limit: number = 10, offset: number = 0): Promise<Project[]> {
    const projects = await (this.prisma as any).project.findMany({
      where: {
        createdBy: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return projects.map((project: PrismaProject) => ({
      ...project,
      worker_need: project.workerNeed,
      start_date: project.startDate,
      end_date: project.endDate,
      created_by: project.createdBy,
      created_at: project.createdAt,
      updated_at: project.updatedAt,
    })) as Project[];
  }

  async countByUserId(userId: number): Promise<number> {
    return await (this.prisma as any).project.count({
      where: {
        createdBy: userId,
      },
    });
  }
}