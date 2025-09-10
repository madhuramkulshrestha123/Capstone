import Joi from 'joi';

// User validation schemas
export const createUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 30 characters',
      'any.required': 'Username is required',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
  first_name: Joi.string()
    .min(1)
    .max(50)
    .optional()
    .messages({
      'string.min': 'First name must not be empty',
      'string.max': 'First name must not exceed 50 characters',
    }),
  last_name: Joi.string()
    .min(1)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Last name must not be empty',
      'string.max': 'Last name must not exceed 50 characters',
    }),
  role: Joi.string()
    .valid('WORKER', 'SUPERVISOR', 'ADMIN')
    .optional()
    .default('WORKER')
    .messages({
      'any.only': 'Role must be one of: WORKER, SUPERVISOR, ADMIN',
    }),
});

export const updateUserSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .optional()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 30 characters',
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address',
    }),
  first_name: Joi.string()
    .min(1)
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.min': 'First name must not be empty',
      'string.max': 'First name must not exceed 50 characters',
    }),
  last_name: Joi.string()
    .min(1)
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Last name must not be empty',
      'string.max': 'Last name must not exceed 50 characters',
    }),
  avatar_url: Joi.string()
    .uri()
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Avatar URL must be a valid URL',
    }),
  role: Joi.string()
    .valid('WORKER', 'SUPERVISOR', 'ADMIN')
    .optional()
    .messages({
      'any.only': 'Role must be one of: WORKER, SUPERVISOR, ADMIN',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required',
    }),
});

// Job Card validation schemas
export const jobCardRegistrationSchema = Joi.object({
  aadhaarNumber: Joi.string()
    .length(12)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'Aadhaar number must be exactly 12 digits',
      'string.pattern.base': 'Aadhaar number must contain only digits',
      'any.required': 'Aadhaar number is required',
    }),
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'Phone number must be exactly 10 digits',
      'string.pattern.base': 'Phone number must contain only digits',
      'any.required': 'Phone number is required',
    }),
  captchaToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Captcha token is required',
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
  jobCardDetails: Joi.object({
    jobCardNumber: Joi.string()
      .optional()
      .allow(null, ''),
    familyId: Joi.string()
      .required()
      .messages({
        'any.required': 'Family ID is required',
      }),
    headOfHouseholdName: Joi.string()
      .required()
      .messages({
        'any.required': 'Head of household name is required',
      }),
    fatherHusbandName: Joi.string()
      .required()
      .messages({
        'any.required': 'Father/Husband name is required',
      }),
    category: Joi.string()
      .required()
      .messages({
        'any.required': 'Category is required',
      }),
    dateOfRegistration: Joi.date()
      .iso()
      .required()
      .messages({
        'date.iso': 'Date of registration must be in ISO format',
        'any.required': 'Date of registration is required',
      }),
    address: Joi.string()
      .required()
      .messages({
        'any.required': 'Address is required',
      }),
    village: Joi.string()
      .optional()
      .allow(null, ''),
    panchayat: Joi.string()
      .required()
      .messages({
        'any.required': 'Panchayat is required',
      }),
    block: Joi.string()
      .required()
      .messages({
        'any.required': 'Block is required',
      }),
    district: Joi.string()
      .required()
      .messages({
        'any.required': 'District is required',
      }),
    isBPL: Joi.boolean()
      .required()
      .messages({
        'any.required': 'BPL status is required',
      }),
    epicNo: Joi.string()
      .optional()
      .allow(null, ''),
    applicants: Joi.array()
      .items(Joi.object({
        name: Joi.string()
          .required()
          .messages({
            'any.required': 'Applicant name is required',
          }),
        gender: Joi.string()
          .required()
          .messages({
            'any.required': 'Applicant gender is required',
          }),
        age: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            'number.integer': 'Applicant age must be a whole number',
            'number.min': 'Applicant age must be at least 1',
            'any.required': 'Applicant age is required',
          }),
        bankDetails: Joi.string()
          .required()
          .messages({
            'any.required': 'Bank details are required',
          }),
      }))
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one applicant is required',
        'any.required': 'Applicants list is required',
      }),
  }).required()
  .messages({
    'any.required': 'Job card details are required',
  }),
});

// Product validation schemas (keeping for backward compatibility)
export const createProductSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Product name must not be empty',
      'string.max': 'Product name must not exceed 100 characters',
      'any.required': 'Product name is required',
    }),
  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 1000 characters',
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is required',
    }),
  image_url: Joi.string()
    .uri()
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Image URL must be a valid URL',
    }),
  category: Joi.string()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Category must not exceed 50 characters',
    }),
  stock_quantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.integer': 'Stock quantity must be a whole number',
      'number.min': 'Stock quantity cannot be negative',
    }),
});

export const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Product name must not be empty',
      'string.max': 'Product name must not exceed 100 characters',
    }),
  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 1000 characters',
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'Price must be a positive number',
    }),
  image_url: Joi.string()
    .uri()
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Image URL must be a valid URL',
    }),
  category: Joi.string()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Category must not exceed 50 characters',
    }),
  stock_quantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.integer': 'Stock quantity must be a whole number',
      'number.min': 'Stock quantity cannot be negative',
    }),
  is_active: Joi.boolean()
    .optional(),
});

export const updateStockSchema = Joi.object({
  quantity: Joi.number()
    .integer()
    .required()
    .messages({
      'number.integer': 'Quantity must be a whole number',
      'any.required': 'Quantity is required',
    }),
});

// Project validation schemas
export const createProjectSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'Project name must not be empty',
      'string.max': 'Project name must not exceed 255 characters',
      'any.required': 'Project name is required',
    }),
  description: Joi.string()
    .max(5000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 5000 characters',
    }),
  location: Joi.string()
    .max(255)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Location must not exceed 255 characters',
    }),
  worker_need: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'Worker need must be a whole number',
      'number.positive': 'Worker need must be greater than 0',
      'any.required': 'Worker need is required',
    }),
  start_date: Joi.date()
    .iso()
    .required()
    .messages({
      'date.iso': 'Start date must be in ISO format (YYYY-MM-DD)',
      'any.required': 'Start date is required',
    }),
  end_date: Joi.date()
    .iso()
    .required()
    .messages({
      'date.iso': 'End date must be in ISO format (YYYY-MM-DD)',
      'any.required': 'End date is required',
    }),
  status: Joi.string()
    .valid('pending', 'active', 'completed')
    .optional()
    .default('pending')
    .messages({
      'any.only': 'Status must be one of: pending, active, completed',
    }),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .optional()
    .messages({
      'string.min': 'Project name must not be empty',
      'string.max': 'Project name must not exceed 255 characters',
    }),
  description: Joi.string()
    .max(5000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 5000 characters',
    }),
  location: Joi.string()
    .max(255)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Location must not exceed 255 characters',
    }),
  worker_need: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.integer': 'Worker need must be a whole number',
      'number.positive': 'Worker need must be greater than 0',
    }),
  start_date: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.iso': 'Start date must be in ISO format (YYYY-MM-DD)',
    }),
  end_date: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.iso': 'End date must be in ISO format (YYYY-MM-DD)',
    }),
  status: Joi.string()
    .valid('pending', 'active', 'completed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: pending, active, completed',
    }),
});

// Work Demand Request validation schemas
export const createWorkDemandRequestSchema = Joi.object({
  worker_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'Worker ID must be a whole number',
      'number.positive': 'Worker ID must be a positive number',
      'any.required': 'Worker ID is required',
    }),
  project_id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Project ID must be a valid UUID',
      'any.required': 'Project ID is required',
    }),
  status: Joi.string()
    .valid('pending', 'approved', 'rejected')
    .optional()
    .default('pending')
    .messages({
      'any.only': 'Status must be one of: pending, approved, rejected',
    }),
  allocated_at: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.iso': 'Allocated at must be in ISO format',
    }),
});

export const updateWorkDemandRequestSchema = Joi.object({
  worker_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.integer': 'Worker ID must be a whole number',
      'number.positive': 'Worker ID must be a positive number',
    }),
  project_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.uuid': 'Project ID must be a valid UUID',
    }),
  status: Joi.string()
    .valid('pending', 'approved', 'rejected')
    .optional()
    .messages({
      'any.only': 'Status must be one of: pending, approved, rejected',
    }),
  allocated_at: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.iso': 'Allocated at must be in ISO format',
    }),
});

// Attendance validation schemas
export const createAttendanceSchema = Joi.object({
  worker_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'Worker ID must be a whole number',
      'number.positive': 'Worker ID must be a positive number',
      'any.required': 'Worker ID is required',
    }),
  project_id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Project ID must be a valid UUID',
      'any.required': 'Project ID is required',
    }),
  date: Joi.date()
    .iso()
    .required()
    .messages({
      'date.iso': 'Date must be in ISO format (YYYY-MM-DD)',
      'any.required': 'Date is required',
    }),
  status: Joi.string()
    .valid('PRESENT', 'ABSENT', 'LEAVE')
    .optional()
    .default('PRESENT')
    .messages({
      'any.only': 'Status must be one of: PRESENT, ABSENT, LEAVE',
    }),
});

export const updateAttendanceSchema = Joi.object({
  status: Joi.string()
    .valid('PRESENT', 'ABSENT', 'LEAVE')
    .optional()
    .messages({
      'any.only': 'Status must be one of: PRESENT, ABSENT, LEAVE',
    }),
});

// Payment validation schemas
export const createPaymentSchema = Joi.object({
  worker_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'Worker ID must be a whole number',
      'number.positive': 'Worker ID must be a positive number',
      'any.required': 'Worker ID is required',
    }),
  project_id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Project ID must be a valid UUID',
      'any.required': 'Project ID is required',
    }),
  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Amount must be a positive number',
      'any.required': 'Amount is required',
    }),
});

export const updatePaymentSchema = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'APPROVED', 'REJECTED', 'PAID')
    .optional()
    .messages({
      'any.only': 'Status must be one of: PENDING, APPROVED, REJECTED, PAID',
    }),
  approved_by: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.integer': 'Approved by ID must be a whole number',
      'number.positive': 'Approved by ID must be a positive number',
    }),
});

// Query validation schemas
export const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1)
    .messages({
      'number.integer': 'Page must be a whole number',
      'number.min': 'Page must be at least 1',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .messages({
      'number.integer': 'Limit must be a whole number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100',
    }),
  sortBy: Joi.string()
    .optional()
    .messages({
      'string.base': 'Sort by must be a string',
    }),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .optional()
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either "asc" or "desc"',
    }),
});

export const searchSchema = Joi.object({
  q: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.min': 'Search query must not be empty',
      'any.required': 'Search query is required',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .optional()
    .default(10)
    .messages({
      'number.integer': 'Limit must be a whole number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 50',
    }),
});

// Parameter validation schemas
export const idParamSchema = Joi.object({
  id: Joi.alternatives()
    .try(
      Joi.number().integer().positive(),
      Joi.string().uuid()
    )
    .required()
    .messages({
      'number.integer': 'ID must be a whole number',
      'number.positive': 'ID must be a positive number',
      'string.uuid': 'ID must be a valid UUID',
      'any.required': 'ID is required',
    }),
});