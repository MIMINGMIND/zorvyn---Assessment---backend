# Finance Dashboard Backend Plan

## Goal Description
Build a logically structured backend service for a finance dashboard. The system will handle user authentication, role-based access control, financial record management, and provide summary endpoints for a dashboard. The solution will favor clean architecture, realistic practices (like using JWT, hashed passwords, input validation), and maintainability over extreme complexity. 

## Technical Stack
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQLite (via `sqlite-async` or `sqlite3` wrappers) for easy setup without external dependencies
- **Validation**: Zod
- **Authentication**: JWT & Bcrypt

## Proposed Changes

### Database Schema

**Users Table**
- `id`: UUID / Primary Key
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: Enum ('VIEWER', 'ANALYST', 'ADMIN')
- `status`: Enum ('ACTIVE', 'INACTIVE')
- `created_at`: Timestamp

**Records Table**
- `id`: UUID / Primary Key
- `amount`: Decimal 
- `type`: Enum ('INCOME', 'EXPENSE')
- `category`: String
- `date`: Date
- `notes`: String
- `created_by`: UUID (Foreign Key to Users)
- `created_at`: Timestamp

### Project Structure
```text
src/
  ├── app.ts                 # Express setup
  ├── server.ts              # Entry point
  ├── config/
  │   └── db.ts              # SQLite connection
  ├── middlewares/
  │   ├── auth.middleware.ts # JWT verification and Role checking
  │   └── error.middleware.ts# Global error handler
  ├── controllers/
  │   ├── auth.controller.ts
  │   ├── record.controller.ts
  │   └── dashboard.controller.ts
  ├── services/
  │   ├── user.service.ts
  │   ├── record.service.ts
  │   └── dashboard.service.ts
  ├── routes/
  │   └── api.ts
  └── utils/
      └── validation.ts      # Zod schemas
```

### Access Control Rules
- **VIEWER**: Can read dashboard sumaries. Cannot read raw records, create, update, or delete.
- **ANALYST**: Can read raw records and dashboard summaries. Cannot create, update, or delete.
- **ADMIN**: Can do everything, plus create new users (in a real system, maybe register is public, or only admins can create analysts/admins). For this, registration will be open to create VIEWERS, but ADMIN can update roles.

### Key Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/records` (Filtering by type, category, date, paginated)
- `POST /api/records` 
- `PUT /api/records/:id`
- `DELETE /api/records/:id`
- `GET /api/dashboard/summary` (Total income, Total expenses, Net balance)
- `GET /api/dashboard/category-totals` 

## Verification Plan
### Automated Tests
Currently optional. We will focus on testing the APIs manually via scripts or local requests to ensure status codes and data formats are correct.

### Manual Verification
- Start the server.
- Register users with different roles.
- Create entries as an ADMIN.
- Verify VIEWER gets 403 on `/api/records`.
- Verify ANALYST can read but gets 403 on POST `/api/records`.
- Verify dashboard endpoint provides accurate aggregated numbers.
