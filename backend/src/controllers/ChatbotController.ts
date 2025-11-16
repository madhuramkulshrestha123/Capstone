import { Request, Response, NextFunction } from 'express';
import { JobCardApplicationService } from '../services/JobCardApplicationService';
import { ProjectService } from '../services/ProjectService';
import { PaymentModel } from '../models/PaymentModel';
import { UserModel } from '../models/UserModel';
import { WorkDemandRequestModel } from '../models/WorkDemandRequestModel';
import { ApiResponse } from '../types';
import axios from 'axios';
import { AppError } from '../middlewares/errorMiddleware';

export class ChatbotController {
  private jobCardApplicationService: JobCardApplicationService;
  private projectService: ProjectService;
  private paymentModel: PaymentModel;
  private userModel: UserModel;
  private workDemandRequestModel: WorkDemandRequestModel;

  constructor() {
    this.jobCardApplicationService = new JobCardApplicationService();
    this.projectService = new ProjectService();
    this.paymentModel = new PaymentModel();
    this.userModel = new UserModel();
    this.workDemandRequestModel = new WorkDemandRequestModel();
  }

  public getJobCardData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobCardId } = req.params;
      
      if (!jobCardId) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Job Card ID is required',
          },
        });
        return;
      }

      let application: any;
      
      // Check if it's a tracking ID (starts with JC-) or job card ID (4 letters + 8 digits)
      if (jobCardId.startsWith('JC-')) {
        // Fetch job card application data by tracking ID
        application = await this.jobCardApplicationService.getApplicationByTrackingId(jobCardId);
      } else {
        // Fetch job card application data by job card ID
        application = await this.jobCardApplicationService.getApplicationByJobCardId(jobCardId);
      }
      
      // Get user details if available
      let userDetails: any = null;
      let userId: string | null = null;
      if (application.aadhaarNumber) {
        const user = await this.userModel.findByAadhaar(application.aadhaarNumber);
        if (user) {
          userDetails = {
            name: user.name,
            email: user.email,
            phone: user.phone_number,
            district: user.district,
            panchayat: user.panchayat_id,
            user_id: user.user_id
          };
          userId = user.user_id;
        }
      }

      // Get work history
      let workHistory: any[] = [];
      if (userId) {
        workHistory = await this.userModel.getWorkHistoryByUserId(userId);
      }

      // Get payment history
      let paymentHistory: any[] = [];
      if (userId) {
        paymentHistory = await this.paymentModel.findByWorkerId(userId);
      }

      const response: ApiResponse = {
        success: true,
        data: {
          jobCard: application,
          user: userDetails,
          workHistory,
          paymentHistory
        }
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: {
            message: error.message,
          },
        });
      } else {
        next(error);
      }
    }
  };

  public getProjectData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params;
      
      if (!projectId) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Project ID is required',
          },
        });
        return;
      }

      const project = await this.projectService.getProjectById(projectId);
      
      // Get assigned workers
      const assignedWorkers = await this.projectService.getAssignedWorkersByProjectId(projectId);

      const response: ApiResponse = {
        success: true,
        data: {
          project,
          assignedWorkers
        }
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: {
            message: error.message,
          },
        });
      } else {
        next(error);
      }
    }
  };

  public getPaymentData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { paymentId } = req.params;
      
      if (!paymentId) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Payment ID is required',
          },
        });
        return;
      }

      const payment = await this.paymentModel.findById(paymentId);
      
      const response: ApiResponse = {
        success: true,
        data: payment
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: {
            message: error.message,
          },
        });
      } else {
        next(error);
      }
    }
  };

  public processUserQuery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query, context } = req.body;
      
      if (!query) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Query is required',
          },
        });
        return;
      }

      // For now, we'll return a simple response
      // In a real implementation, this would call the Gemini API
      const responseText = await this.generateResponse(query, context);
      
      const response: ApiResponse = {
        success: true,
        data: {
          response: responseText
        }
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: {
            message: error.message,
          },
        });
      } else {
        next(error);
      }
    }
  };

  private generateResponse = async (query: string, context: any): Promise<string> => {
    try {
      // Call Gemini API
      const geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyAmvGegBZQzFfa8NWoLaFOf5iEz4O3icaI';
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
      
      // Prepare the prompt with context
      let prompt = `You are a helpful assistant for a job card management system. `;
      prompt += `The user has asked: "${query}"\n\n`;
      
      if (context.jobCard) {
        prompt += `Job Card Information:\n`;
        prompt += `ID: ${context.jobCard.trackingId}\n`;
        prompt += `Status: ${context.jobCard.status}\n`;
        prompt += `Head of Household: ${context.jobCard.headOfHouseholdName}\n`;
        prompt += `District: ${context.jobCard.district}\n`;
        prompt += `Panchayat: ${context.jobCard.panchayat}\n\n`;
      }
      
      if (context.user) {
        prompt += `User Information:\n`;
        prompt += `Name: ${context.user.name}\n`;
        prompt += `Email: ${context.user.email}\n`;
        prompt += `Phone: ${context.user.phone}\n\n`;
      }
      
      if (context.workHistory && context.workHistory.length > 0) {
        prompt += `Work History:\n`;
        context.workHistory.slice(0, 3).forEach((work: any, index: number) => {
          prompt += `${index + 1}. ${work.name || work.project_name || 'Unnamed Project'} - ${work.location || 'N/A'} (${new Date(work.start_date).toLocaleDateString()} to ${new Date(work.end_date).toLocaleDateString()}) - ₹${work.wage_per_worker || work.wage || 0}\n`;
        });
        prompt += `\n`;
      }
      
      if (context.paymentHistory && context.paymentHistory.length > 0) {
        prompt += `Payment History:\n`;
        context.paymentHistory.slice(0, 3).forEach((payment: any, index: number) => {
          prompt += `${index + 1}. Project: ${payment.project_name || 'N/A'} - Amount: ₹${payment.amount || 0} - Status: ${payment.status || 'N/A'}\n`;
        });
        prompt += `\n`;
      }
      
      if (context.project) {
        prompt += `Project Information:\n`;
        prompt += `ID: ${context.project.id}\n`;
        prompt += `Name: ${context.project.name}\n`;
        prompt += `Description: ${context.project.description}\n`;
        prompt += `Location: ${context.project.location}\n`;
        prompt += `Status: ${context.project.status}\n`;
        prompt += `Worker Need: ${context.project.worker_need}\n`;
        prompt += `Wage per Worker: ₹${context.project.wage_per_worker}\n`;
        prompt += `Start Date: ${new Date(context.project.start_date).toLocaleDateString()}\n`;
        prompt += `End Date: ${new Date(context.project.end_date).toLocaleDateString()}\n\n`;
      }
      
      if (context.assignedWorkers && context.assignedWorkers.length > 0) {
        prompt += `Assigned Workers: ${context.assignedWorkers.length}\n`;
        context.assignedWorkers.slice(0, 3).forEach((worker: any, index: number) => {
          prompt += `${index + 1}. ${worker.name} - Aadhaar: ${worker.aadhaar_number}\n`;
        });
        prompt += `\n`;
      }
      
      prompt += `Please provide a helpful and concise response to the user's query based on the provided context. `;
      prompt += `If the query is about job cards, payments, or projects, use the context information to provide specific details. `;
      prompt += `If you don't have enough information, ask for more details. `;
      prompt += `Keep your response under 100 words. `;
      prompt += `Use simple, clear language without any markdown formatting, asterisks, or special characters. `;
      prompt += `Respond in a straightforward manner that is easy to understand.`;
      
      const response = await axios.post(geminiUrl, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Extract the response text
      if (response.data.candidates && response.data.candidates[0].content) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new AppError('Invalid response from Gemini API', 500);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Fallback to keyword-based responses
      if (query.toLowerCase().includes('job card') && context.jobCardId) {
        return `Job card ID: ${context.jobCardId}. Ask about work history or payments for this card.`;
      }
      
      if (query.toLowerCase().includes('payment')) {
        return "Need payment info? Share your job card ID to get payment details.";
      }
      
      if (query.toLowerCase().includes('project')) {
        return "Want project info? Share a project ID or ask about specific projects.";
      }
      
      // Default response
      return "I can help you with job cards, payments, and projects. What would you like to know?";
    }
  };
}

/**
 * Test Plan for Chatbot Functionality:
 * 
 * 1. Job Card Data Retrieval:
 *    - Test with valid job card ID (e.g., JC-1234567890-123)
 *    - Test with invalid job card ID
 *    - Test with non-existent job card ID
 * 
 * 2. Project Data Retrieval:
 *    - Test with valid project ID (UUID format)
 *    - Test with invalid project ID
 *    - Test with non-existent project ID
 * 
 * 3. Payment Data Retrieval:
 *    - Test with valid payment ID (UUID format)
 *    - Test with invalid payment ID
 *    - Test with non-existent payment ID
 * 
 * 4. Natural Language Processing:
 *    - Test with job card related queries
 *    - Test with project related queries
 *    - Test with payment related queries
 *    - Test with general queries
 *    - Test with queries in Hindi
 * 
 * 5. Error Handling:
 *    - Test with network errors
 *    - Test with API errors
 *    - Test with invalid input
 *    - Test with missing parameters
 * 
 * 6. Context Management:
 *    - Test context persistence across conversations
 *    - Test context updates with new data
 *    - Test context clearing
 * 
 * 7. Response Generation:
 *    - Test response formatting
 *    - Test response length limits
 *    - Test response relevance
 *    - Test fallback responses
 */
