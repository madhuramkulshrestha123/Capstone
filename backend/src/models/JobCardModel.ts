import Database from '../config/database';
import { PrismaClient } from '@prisma/client';
import { JobCardDetails } from '../types';

// Define the Prisma job card type based on the database schema
interface PrismaJobCard {
  id: number;
  userId: number;
  jobCardNumber: string;
  familyId: string;
  headOfHouseholdName: string;
  fatherHusbandName: string;
  category: string;
  dateOfRegistration: Date;
  address: string;
  village: string;
  panchayat: string;
  block: string;
  district: string;
  isBPL: boolean;
  epicNo: string;
  createdAt: Date;
  updatedAt: Date;
}

export class JobCardModel {
  private prisma: PrismaClient;

  constructor() {
    const db = Database.getInstance();
    this.prisma = db.client;
  }

  async createJobCard(userId: number, jobCardDetails: JobCardDetails): Promise<PrismaJobCard> {
    // Generate a unique job card number if not provided
    const jobCardNumber = jobCardDetails.jobCardNumber || this.generateJobCardNumber();
    
    const jobCard = await (this.prisma as any).jobCard.create({
      data: {
        userId,
        jobCardNumber,
        familyId: jobCardDetails.familyId,
        headOfHouseholdName: jobCardDetails.headOfHouseholdName,
        fatherHusbandName: jobCardDetails.fatherHusbandName,
        category: jobCardDetails.category,
        dateOfRegistration: jobCardDetails.dateOfRegistration,
        address: jobCardDetails.address,
        village: jobCardDetails.village,
        panchayat: jobCardDetails.panchayat,
        block: jobCardDetails.block,
        district: jobCardDetails.district,
        isBPL: jobCardDetails.isBPL,
        epicNo: jobCardDetails.epicNo,
      },
    });

    // Create applicant records
    for (const applicant of jobCardDetails.applicants) {
      await (this.prisma as any).jobCardApplicant.create({
        data: {
          jobCardId: jobCard.id,
          name: applicant.name,
          gender: applicant.gender,
          age: applicant.age,
          bankDetails: applicant.bankDetails,
        },
      });
    }

    return jobCard;
  }

  async findByUserId(userId: number): Promise<PrismaJobCard | null> {
    return await (this.prisma as any).jobCard.findFirst({
      where: {
        userId,
      },
    });
  }

  async findByJobCardNumber(jobCardNumber: string): Promise<PrismaJobCard | null> {
    return await (this.prisma as any).jobCard.findUnique({
      where: {
        jobCardNumber,
      },
    });
  }

  private generateJobCardNumber(): string {
    // Generate a unique job card number (in a real app, this would be more sophisticated)
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `JC-${timestamp}-${random}`;
  }
}