// preload.ts
import { contextBridge, ipcRenderer } from "electron";
import { Expense } from "./models/expense.js";

contextBridge.exposeInMainWorld("ElectronAPI", {
  TestPreload: () => {
    console.log("preload js work !");
  },
  addExpense: (expense: Expense) => ipcRenderer.invoke("add-expense", expense),
  getExpenses: () => ipcRenderer.invoke("get-expenses"),
});
