# Finance Dashboard Backend Walkthrough

## What was built
A robust, clean backend system for a finance dashboard has been implemented prioritizing clarity, correctness, and maintainability.

### Features Implemented
1. **User and Role Management**: Implemented `VIEWER`, `ANALYST`, and `ADMIN` roles using a strict Enum type model.
2. **Authentication**: Developed [auth.controller.ts](file:///Users/leorddavenci/.gemini/antigravity/scratch/finance-dashboard-backend/src/controllers/auth.controller.ts) providing registration and login, with an internal mapping that hashes passwords leveraging `bcryptjs` and signs JSON Web Tokens (`jwt-simple`).
3. **Financial Records**: Implemented full CRUD management for records tracking `amount`, `type`, `category`, and [date](file:///Users/leorddavenci/.gemini/antigravity/scratch/finance-dashboard-backend/src/services/record.service.ts#29-50). Validation is strictly enforced by `Zod` schemas.
4. **Dashboard Summaries**: Implemented aggregation endpoints tracking total income/expense, grouping by category, and listing recent updates using robust SQLite queries.
5. **Access Control**: Used an explicit Express middleware [auth.middleware.ts](file:///Users/leorddavenci/.gemini/antigravity/scratch/finance-dashboard-backend/src/middlewares/auth.middleware.ts) to decode JWTs and apply Role-Based Access Control logic rejecting unauthorized requests with a `403 Forbidden` response.

## Technical Architecture decisions
- **TypeScript**: Typed schemas ([user.model.ts](file:///Users/leorddavenci/.gemini/antigravity/scratch/finance-dashboard-backend/src/models/user.model.ts), [record.model.ts](file:///Users/leorddavenci/.gemini/antigravity/scratch/finance-dashboard-backend/src/models/record.model.ts)) ensured consistency between request validation endpoints and DB results. 
- **Express**: Separated logic cleanly spanning routes -> middlewares -> controllers -> services.
- **SQLite**: Used an in-file database, enabling rapid testing without complex external dependencies. An automatic initialization script [setup_db.ts](file:///Users/leorddavenci/.gemini/antigravity/scratch/finance-dashboard-backend/src/scripts/setup_db.ts) builds tables transparently.
- **Validation and Reliability**: Implemented global error catching ([error.middleware.ts](file:///Users/leorddavenci/.gemini/antigravity/scratch/finance-dashboard-backend/src/middlewares/error.middleware.ts)) and localized validation schemas using Zod to ensure requests only access underlying services if perfectly structured.

## Validation and Testing
An integration test ([src/scripts/test_api.ts](file:///Users/leorddavenci/.gemini/antigravity/scratch/finance-dashboard-backend/src/scripts/test_api.ts)) was executed, simulating operations across separated role accounts.

### Test Workflow
1. Created an `ADMIN` account and registered a `VIEWER` account to generate secure JWTs.
2. The `ADMIN` explicitly created multiple entries (`INCOME` for salary, `EXPENSE` for food).
3. The `VIEWER` explicitly attempted to create a record using their token, generating an expected `403 Forbidden` rejection.
4. Verified that the `VIEWER` could still access the dashboard summary endpoint. The response generated values reflecting the `1500 INCOME` and `50 EXPENSE` correctly dynamically generating a Net balance of `1450`.
5. Finally, the test successfully verified `ADMIN` pagination mapping.

### Test Script Output

```
Server is running on port 3000
Connected to the SQLite database.
--- Registering Admin ---
Admin Token: eyJ0eXAi...
--- Registering Viewer ---
--- Admin creates records ---
Admin created records successfully.
--- Viewer attempts to create record ---
Passed: Viewer forbidden from creating records.
--- Viewer gets dashboard summary ---
Summary: { totalIncome: 1500, totalExpense: 50, netBalance: 1450 }
Passed: Summary values are correct.
--- Admin gets records list ---
Records count: 2
Passed: Admin listed records successfully.
```

The server is robust, validated, appropriately documented in the [README.md](file:///Users/leorddavenci/.gemini/antigravity/scratch/finance-dashboard-backend/README.md), and complete!
