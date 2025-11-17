import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { ProjectService } from '../services/ProjectService';
import { JobCardApplicationService } from '../services/JobCardApplicationService';
import { PaymentService } from '../services/PaymentService';
import { WorkDemandRequestService } from '../services/WorkDemandRequestService';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class AdminDashboardController {
  private userService: UserService;
  private projectService: ProjectService;
  private jobCardApplicationService: JobCardApplicationService;
  private paymentService: PaymentService;
  private workDemandRequestService: WorkDemandRequestService;

  constructor() {
    this.userService = new UserService();
    this.projectService = new ProjectService();
    this.jobCardApplicationService = new JobCardApplicationService();
    this.paymentService = new PaymentService();
    this.workDemandRequestService = new WorkDemandRequestService();
  }

  public getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Fetch all required data in parallel
      const [projects, jobCardApplications, users, payments, workRequests] = await Promise.all([
        this.projectService.getAllProjects(1, 1000), // Get all projects
        this.jobCardApplicationService.getAllApplications(1000, 0), // Get all applications
        this.userService.getAllUsers(1, 1000), // Get all users
        this.paymentService.getAllPayments(1, 1000), // Get all payments
        this.workDemandRequestService.getAllRequests() // Get all work requests
      ]);

      // Calculate statistics
      const totalProjects = projects.total;
      const totalJobCardApplications = jobCardApplications.length;
      const totalActiveWorkers = users.users.filter(user => user.role === 'supervisor').length;
      
      // Count pending payments
      const pendingPayments = payments.payments.filter(payment => payment.status === 'PENDING').length;
      
      // Count upcoming deadlines (work requests with future end dates)
      // Since work requests don't have end dates, we'll count pending requests
      const today = new Date();
      const upcomingDeadlines = workRequests.filter(request => {
        // For now, we'll count all pending requests as upcoming deadlines
        return request.status === 'pending';
      }).length;
      
      // Count managed employees (supervisors)
      const managedEmployees = users.users.filter(user => user.role === 'supervisor').length;

      const stats = {
        totalProjects,
        totalJobCardApplications,
        totalActiveWorkers,
        pendingPayments,
        upcomingDeadlines,
        managedEmployees
      };

      const response: ApiResponse = {
        success: true,
        data: stats
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getRecentActivities = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get recent job card applications (last 5)
      const applications = await this.jobCardApplicationService.getAllApplications(5, 0);
      
      const recentActivities = applications.map(app => ({
        id: app.trackingId,
        name: app.headOfHouseholdName,
        district: app.district,
        status: app.status,
        createdAt: app.createdAt
      }));

      const response: ApiResponse = {
        success: true,
        data: recentActivities
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getPendingJobCardApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get pending job card applications
      const applications = await this.jobCardApplicationService.getApplicationsByStatus('pending', 5, 0);
      
      const pendingApplications = applications.map(app => ({
        id: app.trackingId,
        name: app.headOfHouseholdName,
        district: app.district,
        status: app.status,
        createdAt: app.createdAt
      }));

      const response: ApiResponse = {
        success: true,
        data: pendingApplications
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}