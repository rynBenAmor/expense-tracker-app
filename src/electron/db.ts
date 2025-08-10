// db.ts

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Expense } from "./models/expense.js";

let db: Database | null = null;

export async function initDB() {
  db = await open({
    filename: "expenses.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      amount REAL,
      category TEXT,
      date TEXT,
      notes TEXT
    )
  `);
}

export async function addExpense(expense: Expense) {
  if (!db) throw new Error("Database not initialized");
  const { type, amount, category, date, notes } = expense;
  await db.run(
    `INSERT INTO expenses (type, amount, category, date, notes) VALUES (?, ?, ?, ?, ?)`,
    [type, amount, category, date, notes || ""]
  );
}

export async function getAllExpenses(): Promise<Expense[]> {
  if (!db) throw new Error("Database not initialized");
  return db.all<Expense[]>(`SELECT * FROM expenses ORDER BY date DESC`);
}
