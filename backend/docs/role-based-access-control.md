# Role-Based Access Control (RBAC) System

## Overview

This document describes the Role-Based Access Control (RBAC) system implemented in the Capstone Backend API. The system defines three distinct user roles with specific permissions and access levels.

## User Roles

### 1. Worker (WORKER)
- **Description**: Workers are individuals who register once, ask for work, attend projects, and get paid in bank.
- **User Type**: Gram Rozgar Sevak (GRAM ROZGAR SEVAK)
- **Key Responsibilities**:
  - Register for work using job cards
  - Request work assignments
  - Attend assigned projects
  - Receive payments for work completed

### 2. Supervisor (SUPERVISOR)
- **Description**: Supervisors mark digital attendance at the project site.
- **User Type**: Gram Rozgar Sevak (GRAM ROZGAR SEVAK)
- **Key Responsibilities**:
  - Mark attendance for workers at project sites
  - Update attendance records as needed
  - View attendance records for projects they supervise

### 3. Admin (ADMIN)
- **Description**: Admins create projects and approve payments online.
- **User Type**: Gram Panchayat (GRAM PANCHAYAT)
- **Key Responsibilities**:
  - Create and manage projects
  - Approve or reject work demand requests
  - Approve or reject payment requests
  - Manage user accounts and roles
  - View all system data

## Role Permissions Matrix

| Feature/Operation | Worker | Supervisor | Admin |
|-------------------|--------|------------|-------|
| **User Management** |
| View own profile | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Update any user | ❌ | ❌ | ✅ |
| Delete any user | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ✅ |
| **Project Management** |
| View all projects | ✅ | ✅ | ✅ |
| Create projects | ❌ | ❌ | ✅ |
| Update projects | ❌ | ❌ | ✅ |
| Delete projects | ❌ | ❌ | ✅ |
| **Work Demand Requests** |
| Create requests | ✅ | ❌ | ❌ |
| View own requests | ✅ | ❌ | ❌ |
| View all requests | ❌ | ❌ | ✅ |
| Approve/reject requests | ❌ | ❌ | ✅ |
| Update requests | ❌ | ❌ | ✅ |
| Delete requests | ❌ | ❌ | ✅ |
| **Attendance Management** |
| Mark attendance | ❌ | ✅ | ✅ |
| View own attendance | ✅ | ❌ | ❌ |
| View project attendance | ❌ | ✅ | ✅ |
| Update attendance | ❌ | ✅ | ✅ |
| Delete attendance | ❌ | ❌ | ✅ |
| **Payment Management** |
| View own payments | ✅ | ❌ | ❌ |
| View all payments | ❌ | ❌ | ✅ |
| Create payments | ❌ | ❌ | ✅ |
| Approve payments | ❌ | ❌ | ✅ |
| Reject payments | ❌ | ❌ | ✅ |
| Mark payments as paid | ❌ | ❌ | ✅ |
| Update payments | ❌ | ❌ | ✅ |
| Delete payments | ❌ | ❌ | ✅ |

## API Endpoints and Role Requirements

### Authentication
- `POST /api/v1/users/register` - Public (No authentication required)
- `POST /api/v1/users/login` - Public (No authentication required)
- `POST /api/v1/users/refresh-token` - Public (No authentication required)

### User Management
- `GET /api/v1/users/profile` - Authenticated users
- `PUT /api/v1/users/profile` - Authenticated users
- `GET /api/v1/users` - Admin only
- `GET /api/v1/users/:id` - Admin only
- `PUT /api/v1/users/:id` - Admin only
- `DELETE /api/v1/users/:id` - Admin only

### Project Management
- `GET /api/v1/projects` - Authenticated users
- `GET /api/v1/projects/:id` - Authenticated users
- `POST /api/v1/projects` - Admin only
- `PUT /api/v1/projects/:id` - Admin only
- `DELETE /api/v1/projects/:id` - Admin only
- `GET /api/v1/projects/my/projects` - Authenticated users
- `GET /api/v1/projects/status/:status` - Authenticated users

### Work Demand Requests
- `GET /api/v1/work-requests` - Admin only
- `GET /api/v1/work-requests/:id` - Admin only
- `POST /api/v1/work-requests` - Worker only
- `PUT /api/v1/work-requests/:id` - Admin only
- `DELETE /api/v1/work-requests/:id` - Admin only
- `GET /api/v1/work-requests/my/requests` - Worker only
- `GET /api/v1/work-requests/project/:projectId` - Admin only
- `PATCH /api/v1/work-requests/:id/approve` - Admin only
- `PATCH /api/v1/work-requests/:id/reject` - Admin only

### Attendance Management
- `GET /api/v1/attendances` - Admin only
- `GET /api/v1/attendances/:id` - Admin only
- `POST /api/v1/attendances` - Supervisor/Admin only
- `PUT /api/v1/attendances/:id` - Supervisor/Admin only
- `DELETE /api/v1/attendances/:id` - Admin only
- `GET /api/v1/attendances/my/attendances` - Worker only
- `GET /api/v1/attendances/project/:projectId` - Supervisor/Admin only
- `GET /api/v1/attendances/project/:projectId/date-range` - Supervisor/Admin only

### Payment Management
- `GET /api/v1/payments` - Admin only
- `GET /api/v1/payments/:id` - Admin only
- `POST /api/v1/payments` - Admin only
- `PUT /api/v1/payments/:id` - Admin only
- `DELETE /api/v1/payments/:id` - Admin only
- `GET /api/v1/payments/my/payments` - Worker only
- `GET /api/v1/payments/project/:projectId` - Admin only
- `PATCH /api/v1/payments/:id/approve` - Admin only
- `PATCH /api/v1/payments/:id/reject` - Admin only
- `PATCH /api/v1/payments/:id/paid` - Admin only

## Implementation Details

### Authentication Middleware
The system uses JWT (JSON Web Tokens) for authentication. When a user logs in, they receive an access token that contains their user information including their role.

### Role Validation
Role validation is implemented at two levels:
1. **Route-level validation**: Middleware functions check user roles before allowing access to specific routes.
2. **Controller-level validation**: Controllers perform additional checks when necessary.

### Middleware Functions
- `authenticateToken`: Verifies JWT tokens and extracts user information
- `requireRole(roles)`: Checks if the authenticated user has one of the specified roles
- `requireWorker`: Shortcut for requiring WORKER role
- `requireSupervisor`: Shortcut for requiring SUPERVISOR role
- `requireAdmin`: Shortcut for requiring ADMIN role
- `requireSupervisorOrAdmin`: Shortcut for requiring either SUPERVISOR or ADMIN role

## Default Role Assignment

When a new user registers, they are assigned the `WORKER` role by default. Only administrators can change user roles.

## Security Considerations

1. **Token Security**: JWT tokens are signed with a secret key and have expiration times.
2. **Role Enforcement**: Role checks are performed at both route and controller levels to ensure security.
3. **Data Isolation**: Users can only access data they are authorized to view based on their role.
4. **Audit Trail**: All actions are logged for security auditing purposes.

## Future Enhancements

1. **Granular Permissions**: Implement more fine-grained permissions within roles
2. **Role Hierarchies**: Define role hierarchies for more complex permission models
3. **Temporary Role Assignments**: Allow temporary role assignments for special projects
4. **Multi-factor Authentication**: Add support for multi-factor authentication for admin users