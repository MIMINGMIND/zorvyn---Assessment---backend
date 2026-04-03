export enum RecordType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface FinancialRecord {
  id: string;
  user_id: string;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
  created_at: string;
}
