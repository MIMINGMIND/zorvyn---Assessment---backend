import { dbRun, dbGet, dbQuery } from '../config/db';
import { FinancialRecord, RecordType } from '../models/record.model';
import { v4 as uuidv4 } from 'uuid';

export class RecordService {
  static async createRecord(
    userId: string,
    amount: number,
    type: RecordType,
    category: string,
    date: string,
    notes?: string
  ): Promise<FinancialRecord> {
    const id = uuidv4();
    await dbRun(
      'INSERT INTO financial_records (id, user_id, amount, type, category, date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, userId, amount, type, category, date, notes || null]
    );

    const record = await this.getRecordById(id);
    return record!;
  }

  static async getRecordById(id: string): Promise<FinancialRecord | undefined> {
    const row = await dbGet('SELECT * FROM financial_records WHERE id = ?', [id]);
    return row as FinancialRecord | undefined;
  }

  static async updateRecord(
    id: string,
    updates: Partial<Omit<FinancialRecord, 'id' | 'user_id' | 'created_at'>>
  ): Promise<FinancialRecord | undefined> {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return this.getRecordById(id);

    values.push(id);
    await dbRun(`UPDATE financial_records SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.getRecordById(id);
  }

  static async deleteRecord(id: string): Promise<boolean> {
    const result = await dbRun('DELETE FROM financial_records WHERE id = ?', [id]);
    return result.changes > 0;
  }

  static async getRecords(
    filters: { type?: RecordType; category?: string; startDate?: string; endDate?: string },
    limit: number = 10,
    offset: number = 0
  ): Promise<FinancialRecord[]> {
    let sql = 'SELECT * FROM financial_records WHERE 1=1';
    const params: any[] = [];

    if (filters.type) {
      sql += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters.category) {
      sql += ' AND category = ?';
      params.push(filters.category);
    }
    if (filters.startDate) {
      sql += ' AND date >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      sql += ' AND date <= ?';
      params.push(filters.endDate);
    }

    sql += ' ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = await dbQuery(sql, params);
    return rows as FinancialRecord[];
  }
}
