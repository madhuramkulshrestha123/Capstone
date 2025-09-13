# Sample Data for Projects

This directory contains sample data for testing the Project feature of the application.

## Sample Projects

The [sample-projects.json](file:///C:/Users/DELL/Documents/GitHub/Capstone/backend/test-data/sample-projects.json) file contains 10 sample projects with realistic data including:

- **Diverse Project Types**: Road construction, school renovation, water pipeline installation, health center construction, irrigation systems, bridge construction, solar power plants, waste management facilities, digital literacy centers, and women's self-help group centers.

- **Realistic Locations**: Various states in India to represent the target demographic.

- **Varied Worker Requirements**: Projects requiring between 15-100 workers to test scalability.

- **Different Status Values**: Projects in "pending", "active", and "completed" states.

- **Realistic Timeframes**: Project durations ranging from 1 month to 2 years.

## Usage

### Seeding the Database

To seed the database with sample projects, run:

```bash
npm run db:seed:projects
```

Or directly:

```bash
node seed-projects.js
```

This script will:
1. Ensure an admin user exists (creates one if needed)
2. Create all sample projects that don't already exist in the database
3. Display a summary of projects by status

Note: This requires the database tables to be created first. If you encounter errors about missing tables, you need to run the database migrations first.

### Database Migration

If you encounter errors about missing tables, you need to run the database migrations:

1. Set up a direct database connection (see SETUP_DATABASE.md)
2. Run the migrations:
   ```bash
   npx prisma migrate dev
   ```

### SQL Insert Statements

If you prefer to manually insert the data, you can generate SQL insert statements:

```bash
node generate-project-inserts.js
```

This will output SQL INSERT statements that you can run directly in your database client.

### API Testing

The sample data can be used for API testing with the following endpoints:

- `POST /api/v1/projects` - Create new projects
- `GET /api/v1/projects` - Retrieve all projects with pagination
- `GET /api/v1/projects/:id` - Retrieve a specific project
- `GET /api/v1/projects/status/:status` - Retrieve projects by status
- `PUT /api/v1/projects/:id` - Update an existing project
- `DELETE /api/v1/projects/:id` - Delete a project

### Sample Project Data Structure

Each project in the JSON file follows this structure:

```json
{
  "name": "Project Name",
  "description": "Detailed description of the project",
  "location": "Geographical location",
  "worker_need": 50,
  "start_date": "2023-07-01",
  "end_date": "2024-06-30",
  "status": "active"
}
```

## API Endpoints Documentation

The [project-api-endpoints.json](file:///C:/Users/DELL/Documents/GitHub/Capstone/backend/test-data/project-api-endpoints.json) file contains detailed documentation of all project-related API endpoints, including:

- HTTP methods and paths
- Request and response examples
- Authentication requirements
- Query and path parameters

## Project Status Values

Projects can have one of three status values:

1. **pending** - Project is approved but not yet started
2. **active** - Project is currently underway
3. **completed** - Project has been finished

## Notes

- All dates are in ISO format (YYYY-MM-DD)
- Worker needs are represented as positive integers
- Location is stored as a string (future enhancement could use geolocation data)
- Descriptions can be up to 5000 characters
- Project names are limited to 255 characters