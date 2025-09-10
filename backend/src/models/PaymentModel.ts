import Database from '../config/database';
import { PrismaClient } from '@prisma/client';
import { Payment, CreatePaymentRequest, UpdatePaymentRequest } from '../types';

// Define the Prisma payment type based on the database schema
interface PrismaPayment {
  id: string;
  workerId: number;
  projectId: string;
  amount: any; // Prisma Decimal type
  status: string;
  approvedBy: number | null;
  approvedAt: Date | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentModel {
  private prisma: PrismaClient;

  constructor() {
    const db = Database.getInstance();
    this.prisma = db.client;
  }

  async findAll(limit: number = 10, offset: number = 0, status?: string): Promise<Payment[]> {
    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    const payments = await (this.prisma as any).payment.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return payments.map((payment: PrismaPayment) => ({
      ...payment,
      worker_id: payment.workerId,
      project_id: payment.projectId,
      approved_by: payment.approvedBy,
      approved_at: payment.approvedAt,
      paid_at: payment.paidAt,
      created_at: payment.createdAt,
      updated_at: payment.updatedAt,
      amount: Number(payment.amount),
    })) as Payment[];
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await (this.prisma as any).payment.findUnique({
      where: {
        id,
      },
    });

    if (!payment) return null;

    return {
      ...payment,
      worker_id: payment.workerId,
      project_id: payment.projectId,
      approved_by: payment.approvedBy,
      approved_at: payment.approvedAt,
      paid_at: payment.paidAt,
      created_at: payment.createdAt,
      updated_at: payment.updatedAt,
      amount: Number(payment.amount),
    } as Payment;
  }

  async create(paymentData: CreatePaymentRequest): Promise<Payment> {
    const payment = await (this.prisma as any).payment.create({
      data: {
        workerId: paymentData.worker_id,
        projectId: paymentData.project_id,
        amount: paymentData.amount,
      },
    });

    return {
      ...payment,
      worker_id: payment.workerId,
      project_id: payment.projectId,
      approved_by: payment.approvedBy,
      approved_at: payment.approvedAt,
      paid_at: payment.paidAt,
      created_at: payment.createdAt,
      updated_at: payment.updatedAt,
      amount: Number(payment.amount),
    } as Payment;
  }

  async update(id: string, paymentData: UpdatePaymentRequest, adminId?: number): Promise<Payment | null> {
    const updateData: any = {};

    if (paymentData.status !== undefined) updateData.status = paymentData.status;
    if (paymentData.approved_by !== undefined) updateData.approvedBy = paymentData.approved_by;

    // Set approvedAt timestamp when status is changed to APPROVED
    if (paymentData.status === 'APPROVED' && adminId) {
      updateData.approvedBy = adminId;
      updateData.approvedAt = new Date();
    }

    // Set paidAt timestamp when status is changed to PAID
    if (paymentData.status === 'PAID') {
      updateData.paidAt = new Date();
    }

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    try {
      const payment = await (this.prisma as any).payment.update({
        where: {
          id,
        },
        data: updateData,
      });

      return {
        ...payment,
        worker_id: payment.workerId,
        project_id: payment.projectId,
        approved_by: payment.approvedBy,
        approved_at: payment.approvedAt,
        paid_at: payment.paidAt,
        created_at: payment.createdAt,
        updated_at: payment.updatedAt,
        amount: Number(payment.amount),
      } as Payment;
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await (this.prisma as any).payment.delete({
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

    return await (this.prisma as any).payment.count({
      where: whereClause,
    });
  }

  async findByWorkerId(workerId: number, limit: number = 10, offset: number = 0): Promise<Payment[]> {
    const payments = await (this.prisma as any).payment.findMany({
      where: {
        workerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return payments.map((payment: PrismaPayment) => ({
      ...payment,
      worker_id: payment.workerId,
      project_id: payment.projectId,
      approved_by: payment.approvedBy,
      approved_at: payment.approvedAt,
      paid_at: payment.paidAt,
      created_at: payment.createdAt,
      updated_at: payment.updatedAt,
      amount: Number(payment.amount),
    })) as Payment[];
  }

  async findByProjectId(projectId: string, limit: number = 10, offset: number = 0): Promise<Payment[]> {
    const payments = await (this.prisma as any).payment.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return payments.map((payment: PrismaPayment) => ({
      ...payment,
      worker_id: payment.workerId,
      project_id: payment.projectId,
      approved_by: payment.approvedBy,
      approved_at: payment.approvedAt,
      paid_at: payment.paidAt,
      created_at: payment.createdAt,
      updated_at: payment.updatedAt,
      amount: Number(payment.amount),
    })) as Payment[];
  }

  async countByWorkerId(workerId: number): Promise<number> {
    return await (this.prisma as any).payment.count({
      where: {
        workerId,
      },
    });
  }

  async countByProjectId(projectId: string): Promise<number> {
    return await (this.prisma as any).payment.count({
      where: {
        projectId,
      },
    });
  }
}