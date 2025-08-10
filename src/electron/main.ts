//main.ts
import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import { Expense } from "./models/expense.js";
import { initDB, addExpense, getAllExpenses } from "./db.js";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true, // TODO fix this : preload won't work without this
      
    },
  });

  if (isDev()) {
    console.warn("\x1b[33m%s\x1b[0m", "WARNING: This is a development server"); //ANSI Escape Codes
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-vue/index.html"));
    Menu.setApplicationMenu(null); //remove bar on prod
  }
}


app.whenReady().then(async () => {
  await initDB();

  ipcMain.handle("add-expense", async (_event, expense: Expense) => {
    await addExpense(expense);
    return { success: true };
  });

  ipcMain.handle("get-expenses", async () => {
    return await getAllExpenses();
  });

  createWindow();
});