import { PaymentModel } from '../models/PaymentModel';
import { AttendanceModel } from '../models/AttendanceModel';
import { ProjectModel } from '../models/ProjectModel';
import { AppError } from '../middlewares/errorMiddleware';
import { CreatePaymentRequest, UpdatePaymentRequest, Payment } from '../types';

export class PaymentService {
  private paymentModel: PaymentModel;
  private attendanceModel: AttendanceModel;
  private projectModel: ProjectModel;

  constructor() {
    this.paymentModel = new PaymentModel();
    this.attendanceModel = new AttendanceModel();
    this.projectModel = new ProjectModel();
  }

  async getAllPayments(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{
    payments: Payment[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.paymentModel.findAll(limit, offset, status),
      this.paymentModel.count(status),
    ]);

    return {
      payments,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id);
    if (!payment) {
      throw new AppError('Payment record not found', 404);
    }
    return payment;
  }

  async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    // Validate payment amount
    if (paymentData.amount <= 0) {
      throw new AppError('Payment amount must be greater than 0', 400);
    }

    const payment = await this.paymentModel.create(paymentData);
    return payment;
  }

  async updatePayment(id: string, paymentData: UpdatePaymentRequest, adminId?: string): Promise<Payment> {
    // Check if payment exists
    const existingPayment = await this.paymentModel.findById(id);
    if (!existingPayment) {
      throw new AppError('Payment record not found', 404);
    }

    // Validate that only admins can approve payments
    if (paymentData.status === 'APPROVED' && !adminId) {
      throw new AppError('Only administrators can approve payments', 403);
    }

    const updatedPayment = await this.paymentModel.update(id, paymentData, adminId);
    if (!updatedPayment) {
      throw new AppError('Failed to update payment', 500);
    }

    return updatedPayment;
  }

  async deletePayment(id: string): Promise<void> {
    const payment = await this.paymentModel.findById(id);
    if (!payment) {
      throw new AppError('Payment record not found', 404);
    }

    const deleted = await this.paymentModel.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete payment', 500);
    }
  }

  async getPaymentsByWorkerId(workerId: string, page: number = 1, limit: number = 10): Promise<{
    payments: Payment[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.paymentModel.findByWorkerId(workerId, limit, offset),
      this.paymentModel.countByWorkerId(workerId),
    ]);

    return {
      payments,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPaymentsByProjectId(projectId: string, page: number = 1, limit: number = 10): Promise<{
    payments: Payment[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.paymentModel.findByProjectId(projectId, limit, offset),
      this.paymentModel.countByProjectId(projectId),
    ]);

    return {
      payments,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approvePayment(id: string, adminId: string): Promise<Payment> {
    const paymentData: UpdatePaymentRequest = {
      status: 'APPROVED',
    };

    return this.updatePayment(id, paymentData, adminId);
  }

  async rejectPayment(id: string, adminId: string): Promise<Payment> {
    const paymentData: UpdatePaymentRequest = {
      status: 'REJECTED',
    };

    return this.updatePayment(id, paymentData, adminId);
  }

  async markAsPaid(id: string): Promise<Payment> {
    const paymentData: UpdatePaymentRequest = {
      status: 'PAID',
    };

    return this.updatePayment(id, paymentData);
  }

  async generatePaymentsFromAttendance(projectId: string, startDate?: string, endDate?: string): Promise<Payment[]> {
    // Get the project to get wage information
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    
    // Get attendance records for the project within the date range
    let attendanceRecords;
    if (startDate && endDate) {
      attendanceRecords = await this.attendanceModel.findByDateRange(
        projectId,
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      attendanceRecords = await this.attendanceModel.findByProjectId(projectId, 1000, 0); // Assuming a large limit
    }
    
    // Group attendance by worker_id to calculate days worked per worker
    const attendanceByWorker: Record<string, any[]> = {};
    attendanceRecords.forEach(record => {
      if (record && record.status === 'PRESENT') {
        const workerId = record.worker_id;
        if (!attendanceByWorker[workerId]) {
          attendanceByWorker[workerId] = [];
        }
        attendanceByWorker[workerId].push(record);
      }
    });
    
    // Calculate payments for each worker
    const payments: Payment[] = [];
    
    for (const [workerId, workerAttendance] of Object.entries(attendanceByWorker)) {
      const daysWorked = workerAttendance.length;
      const amount = daysWorked * (project.wage_per_worker || 0);
      
      if (amount > 0) {
        // Check if a payment record already exists for this worker and project for the given date range
        // We'll get all payments for this project and check if one already exists for this worker
        // with similar amount that corresponds to the days worked in the given date range
        const existingPaymentsForProject = await this.paymentModel.findByProjectId(projectId, 1000, 0);
        const existingPaymentForWorkerInProject = existingPaymentsForProject.some(payment => 
          payment.worker_id === workerId &&
          payment.amount === amount // Match the exact amount which should correspond to days worked * wage
        );
        
        if (!existingPaymentForWorkerInProject) {
          // Create a new payment record
          const paymentData: CreatePaymentRequest = {
            worker_id: workerId,
            project_id: projectId,
            amount: amount,
          };
          
          const payment = await this.createPayment(paymentData);
          payments.push(payment);
        }
      }
    }
    
    return payments;
  }
}