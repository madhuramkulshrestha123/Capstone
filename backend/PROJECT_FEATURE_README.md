# Project Feature Documentation

## Overview
This document describes the new Project feature that replaces the previous Product Services functionality. The Project feature allows users to create, manage, and track work projects with details such as location, worker requirements, and scheduling.

## Database Schema

### projects Table
| Field        | Type      | Constraints                         |
| ------------ | --------- | ----------------------------------- |
| project_id   | UUID      | PRIMARY KEY                         |
| name         | VARCHAR   | NOT NULL                            |
| description  | TEXT      |                                     |
| location     | GEOGRAPHY | Point data type (lat, long)         |
| worker_need  | INTEGER   | NOT NULL                            |
| start_date   | DATE      | NOT NULL                            |
| end_date     | DATE      | NOT NULL                            |
| status       | ENUM      | ['pending', 'active', 'completed']  |
| created_by   | UUID      | FOREIGN KEY → users(user_id)        |
| created_at   | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP           |
| updated_at   | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP           |

## API Endpoints

### Public Routes
- `GET /api/v1/projects` - Get all projects with pagination
- `GET /api/v1/projects/:id` - Get a specific project by ID
- `GET /api/v1/projects/status/:status` - Get projects by status

### Protected Routes
- `POST /api/v1/projects` - Create a new project
- `PUT /api/v1/projects/:id` - Update an existing project
- `DELETE /api/v1/projects/:id` - Delete a project
- `GET /api/v1/projects/my/projects` - Get projects created by the authenticated user

## Data Models

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  worker_need: number;
  start_date: Date;
  end_date: Date;
  status: 'pending' | 'active' | 'completed';
  created_by: number;
  created_at: Date;
  updated_at: Date;
}
```

### CreateProjectRequest
```typescript
interface CreateProjectRequest {
  name: string;
  description?: string;
  location?: string;
  worker_need: number;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  status?: 'pending' | 'active' | 'completed';
}
```

### UpdateProjectRequest
```typescript
interface UpdateProjectRequest {
  name?: string;
  description?: string;
  location?: string;
  worker_need?: number;
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
  status?: 'pending' | 'active' | 'completed';
}
```

## Implementation Files

1. `src/models/ProjectModel.ts` - Database operations for projects
2. `src/services/ProjectService.ts` - Business logic for projects
3. `src/controllers/ProjectController.ts` - Request handling for projects
4. `src/routes/projectRoutes.ts` - API routes for projects
5. `src/types/index.ts` - Updated type definitions
6. `src/utils/validationSchemas.ts` - Validation schemas for project data
7. `prisma/schema.prisma` - Updated Prisma schema with Project model

## Database Migration

To apply the database changes, run:
```bash
npx prisma migrate dev --name add_project_models
```

## Testing

To test the new Project feature:

1. Start the server: `npm run dev`
2. Use the API endpoints listed above
3. Authentication is required for create, update, and delete operations

## Future Enhancements

1. Add geospatial support for location field
2. Implement project assignment to workers
3. Add project progress tracking
4. Implement notifications for project updates