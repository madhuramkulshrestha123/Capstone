# Work Demand Request Feature Documentation

## Overview
This document describes the new Work Demand Request feature that allows workers to request to work on projects and administrators to approve or reject these requests.

## Database Schema

### work_demand_requests Table
| Field         | Type      | Constraints                          |
| ------------- | --------- | ------------------------------------ |
| request_id    | UUID      | PRIMARY KEY                          |
| worker_id     | UUID      | FOREIGN KEY → users(user_id)         |
| project_id    | UUID      | FOREIGN KEY → projects(project_id)   |
| request_time  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP            |
| status        | ENUM      | ['pending', 'approved', 'rejected']  |
| allocated_at  | TIMESTAMP | Nullable (when approved)             |

## API Endpoints

### Public Routes
- `GET /api/v1/work-requests` - Get all work demand requests with pagination
- `GET /api/v1/work-requests/:id` - Get a specific work demand request by ID

### Protected Routes
- `POST /api/v1/work-requests` - Create a new work demand request
- `PUT /api/v1/work-requests/:id` - Update an existing work demand request
- `DELETE /api/v1/work-requests/:id` - Delete a work demand request
- `GET /api/v1/work-requests/my/requests` - Get work requests created by the authenticated worker
- `GET /api/v1/work-requests/project/:projectId` - Get work requests for a specific project
- `PATCH /api/v1/work-requests/:id/approve` - Approve a work demand request
- `PATCH /api/v1/work-requests/:id/reject` - Reject a work demand request

## Data Models

### WorkDemandRequest
```typescript
interface WorkDemandRequest {
  id: string;
  worker_id: number;
  project_id: string;
  request_time: Date;
  status: 'pending' | 'approved' | 'rejected';
  allocated_at?: Date;
}
```

### CreateWorkDemandRequest
```typescript
interface CreateWorkDemandRequest {
  worker_id: number;
  project_id: string;
  status?: 'pending' | 'approved' | 'rejected';
  allocated_at?: string; // ISO date string
}
```

### UpdateWorkDemandRequest
```typescript
interface UpdateWorkDemandRequest {
  worker_id?: number;
  project_id?: string;
  status?: 'pending' | 'approved' | 'rejected';
  allocated_at?: string; // ISO date string
}
```

## Implementation Files

1. `src/models/WorkDemandRequestModel.ts` - Database operations for work demand requests
2. `src/services/WorkDemandRequestService.ts` - Business logic for work demand requests
3. `src/controllers/WorkDemandRequestController.ts` - Request handling for work demand requests
4. `src/routes/workDemandRequestRoutes.ts` - API routes for work demand requests
5. `src/types/index.ts` - Updated type definitions
6. `src/utils/validationSchemas.ts` - Validation schemas for work demand request data
7. `prisma/schema.prisma` - Updated Prisma schema with WorkDemandRequest model

## Database Migration

To apply the database changes, run:
```bash
npx prisma migrate dev --name add_work_demand_request_model
```

## Testing

To test the new Work Demand Request feature:

1. Start the server: `npm run dev`
2. Use the API endpoints listed above
3. Authentication is required for create, update, and delete operations

## Future Enhancements

1. Add notifications for request status changes
2. Implement automatic allocation based on worker skills
3. Add worker availability tracking
4. Implement project capacity limits