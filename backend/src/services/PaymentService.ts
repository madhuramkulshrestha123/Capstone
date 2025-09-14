import { PaymentModel } from '../models/PaymentModel';
import { AppError } from '../middlewares/errorMiddleware';
import { CreatePaymentRequest, UpdatePaymentRequest, Payment } from '../types';

export class PaymentService {
  private paymentModel: PaymentModel;

  constructor() {
    this.paymentModel = new PaymentModel();
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
}