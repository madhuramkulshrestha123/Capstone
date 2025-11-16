import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Handle multipart form data where JSON is in applicationData field
    let validationData = req.body;
    if (req.body.applicationData) {
      try {
        validationData = JSON.parse(req.body.applicationData);
        console.log('Parsed applicationData from multipart form:', validationData);
      } catch (parseError) {
        console.error('Failed to parse applicationData:', parseError);
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid JSON in applicationData field',
          },
        });
        return;
      }
    } else {
      console.log('Received direct form data:', req.body);
    }
    
    const { error } = schema.validate(validationData, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      console.error('Validation errors:', validationErrors);

      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: validationErrors,
        },
      });
      return;
    }

    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        error: {
          message: 'Query validation failed',
          details: validationErrors,
        },
      });
      return;
    }

    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        error: {
          message: 'Parameter validation failed',
          details: validationErrors,
        },
      });
      return;
    }

    next();
  };
};