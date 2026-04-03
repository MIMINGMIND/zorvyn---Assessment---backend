import { dbQuery, dbGet } from '../config/db';

export class DashboardService {
  /**
   * Get total income, total expenses, and net balance across all records (or filtered by date).
   */
  static async getSummary(startDate?: string, endDate?: string) {
    let sql = `
      SELECT 
        SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as totalExpense
      FROM financial_records WHERE 1=1
    `;
    const params: any[] = [];

    if (startDate) {
      sql += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND date <= ?';
      params.push(endDate);
    }

    const row = await dbGet(sql, params);
    const totalIncome = row?.totalIncome || 0;
    const totalExpense = row?.totalExpense || 0;
    const netBalance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netBalance };
  }

  /**
   * Get totals grouped by category for expenses or income.
   */
  static async getCategoryTotals(type: 'INCOME' | 'EXPENSE', startDate?: string, endDate?: string) {
    let sql = `
      SELECT category, SUM(amount) as total
      FROM financial_records
      WHERE type = ?
    `;
    const params: any[] = [type];

    if (startDate) {
      sql += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND date <= ?';
      params.push(endDate);
    }

    sql += ' GROUP BY category ORDER BY total DESC';

    const rows = await dbQuery(sql, params);
    return rows;
  }

  /**
   * Get the N most recent activities.
   */
  static async getRecentActivity(limit = 5) {
    const rows = await dbQuery(
      'SELECT * FROM financial_records ORDER BY date DESC, created_at DESC LIMIT ?', 
      [limit]
    );
    return rows;
  }
}
