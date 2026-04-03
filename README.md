# Finance Dashboard Backend

This is the backend service for a hypothetical Finance Dashboard project. It is designed to demonstrate clean architectural principles without unnecessary complexity, satisfying requirements for User & Role Management, Financial Records CRUD operations, Dashboard analytical metrics, and clear Role-Based Access Control (RBAC).

## Stack & Decisions
*   **Language**: TypeScript (Node.js). Improves maintainability, developer experience, and correctness.
*   **Framework**: Express.js. A lightweight standard. 
*   **Database**: SQLite (`sqlite3`). Stored as a simple local file, providing immediate setup ease for testing and evaluation while keeping structured relational features.
*   **Authentication**: JSON Web Tokens (JWT) & bcrypt. Demonstrates real-world security practices.
*   **Validation**: Zod. Keeps API input parsing robust and error messages clean.

## Roles & Access Control
- `VIEWER`: Can view summaries via `GET /api/dashboard/*`. Cannot access raw records.
- `ANALYST`: Can view dashboard summaries and `GET /api/records`. Cannot create/update/delete records.
- `ADMIN`: Has full access. Can read summaries, view raw records, create, update, and delete them.

## Setup and Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   Runs a script to create tables (`users`, `financial_records`) if they do not exist.
   ```bash
   npx ts-node src/scripts/setup_db.ts
   ```

3. **Start the Server**
   ```bash
   npx ts-node-dev src/server.ts
   ```

The server will start on `http://localhost:3000`.

## API Endpoints

### Auth
*   `POST /api/auth/register` - Create a new user account.`{ email, password, role? }`. Default role is `VIEWER`.
*   `POST /api/auth/login` - Authenticate and get JWT. `{ email, password }`

### Financial Records
*Headers*: `Authorization: Bearer <Token>`
*   `GET /api/records` - (Analyst, Admin) Retrieves paginated records. View history. (Query: `?type=INCOME&category=Salary`)
*   `GET /api/records/:id` - (Analyst, Admin) Get record by ID.
*   `POST /api/records` - (Admin Only) Create a new log. `{ amount, type, category, date, notes }`.
*   `PUT /api/records/:id` - (Admin Only) Update an existing record.
*   `DELETE /api/records/:id` - (Admin Only) Delete a record.

### Dashboard Summaries
*Headers*: `Authorization: Bearer <Token>`
*   `GET /api/dashboard/summary` - (All Roles) Get aggregated `totalIncome`, `totalExpense`, and `netBalance`.
*   `GET /api/dashboard/category-totals?type=EXPENSE` - (All Roles) Get totals grouped by category (e.g. rent, groceries).
*   `GET /api/dashboard/recent` - (All Roles) Get the most recent 5 transaction activities.

## Structural Design
The system uses standard controller-service separation:
*   `middlewares/` contains auth decoding, RBAC checks, and error catching.
*   `controllers/` handle data validation, formatting payload into standard responses.
*   `services/` handle core business logic and direct database retrieval with mapping.
*   `models/` contain type definitions for the application's domain logic.
*   `utils/` container validation schema instances leveraging Zod.
