import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { RecordController } from '../controllers/record.controller';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { Role } from '../models/user.model';

const router = Router();

// ==== Authentication ====
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// ==== Financial Records ====
// VIEWER cannot access raw records. ANALYST and ADMIN can read.
router.get('/records', authenticate, requireRole([Role.ANALYST, Role.ADMIN]), RecordController.getRecords);
router.get('/records/:id', authenticate, requireRole([Role.ANALYST, Role.ADMIN]), RecordController.getRecordById);

// Only ADMIN can mutate records
router.post('/records', authenticate, requireRole([Role.ADMIN]), RecordController.createRecord);
router.put('/records/:id', authenticate, requireRole([Role.ADMIN]), RecordController.updateRecord);
router.delete('/records/:id', authenticate, requireRole([Role.ADMIN]), RecordController.deleteRecord);

// ==== Dashboard Summaries ====
// All authenticated users (VIEWER, ANALYST, ADMIN) can access dashboard metrics
router.get('/dashboard/summary', authenticate, DashboardController.getSummary);
router.get('/dashboard/category-totals', authenticate, DashboardController.getCategoryTotals);
router.get('/dashboard/recent', authenticate, DashboardController.getRecentActivity);

export default router;
