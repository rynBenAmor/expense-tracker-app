export interface Expense {
  id?: number; // optional for inserts
  type: "expense" | "income";
  amount: number;
  category: string;
  date: string; // ISO string format
  notes?: string;
}
