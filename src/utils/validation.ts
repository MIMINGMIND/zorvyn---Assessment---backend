import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  // Role defaults to VIEWER if not provided, but can be specified
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional().default('VIEWER')
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const createRecordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  notes: z.string().optional()
});

export const updateRecordSchema = createRecordSchema.partial();
