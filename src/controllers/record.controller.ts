import { Request, Response } from 'express';
import { RecordService } from '../services/record.service';
import { createRecordSchema, updateRecordSchema } from '../utils/validation';

export class RecordController {
  static async createRecord(req: Request, res: Response) {
    const parseResult = createRecordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const { amount, type, category, date, notes } = parseResult.data;
    
    // We assume authenticate middleware attaches user to req
    const userId = req.user!.id;

    const record = await RecordService.createRecord(userId, amount, type as any, category, date, notes);
    res.status(201).json(record);
  }

  static async getRecords(req: Request, res: Response) {
    const { type, category, startDate, endDate, limit, offset } = req.query;

    const records = await RecordService.getRecords(
      {
        type: type as any,
        category: category as string,
        startDate: startDate as string,
        endDate: endDate as string
      },
      limit ? parseInt(limit as string, 10) : 10,
      offset ? parseInt(offset as string, 10) : 0
    );

    res.status(200).json(records);
  }

  static async getRecordById(req: Request, res: Response) {
    const id = req.params.id as string;
    const record = await RecordService.getRecordById(id);
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json(record);
  }

  static async updateRecord(req: Request, res: Response) {
    const id = req.params.id as string;
    
    const recordExists = await RecordService.getRecordById(id);
    if (!recordExists) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const parseResult = updateRecordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    // Only allow updating if ADMIN (handled by middleware usually, but just in case)
    // Actually, middleware should restrict the route completely to ADMIN.
    const updatedRecord = await RecordService.updateRecord(id, parseResult.data as any);
    res.status(200).json(updatedRecord);
  }

  static async deleteRecord(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await RecordService.deleteRecord(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json({ message: 'Record deleted successfully' });
  }
}
