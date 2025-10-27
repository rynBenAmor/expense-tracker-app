// DOM Elements
const balanceEl = document.querySelector(".balance-amount");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionFormEl = document.getElementById("transaction-form");
const transactionListEl = document.getElementById("transaction-list");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const typeIncomeEl = document.getElementById("income-type");
//const typeExpenseEl = document.getElementById("expense-type");
const categoryEl = document.getElementById("category");
const filterBtns = document.querySelectorAll(".filter-btn");
const notificationEl = document.getElementById("notification");

// Global variables
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
// Ensure amounts are numbers (sanitize older stored data)
if (!Array.isArray(transactions)) transactions = [];
transactions = transactions.map((t) => ({
  ...t,
  amount: typeof t.amount === "string" ? parseFloat(t.amount) || 0 : Number(t.amount || 0),
}));
let currentFilter = "all";

// Initialize the app
function init() {
  updateTransactionList();
  updateSummary();

  // Add event listeners
  transactionFormEl.addEventListener("submit", addTransaction);
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", handleFilter);
  });
}

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  // Get form data
  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);
  const type = typeIncomeEl.checked ? "income" : "expense";
  const category = categoryEl.value;

  // Validate input
  if (!description || !amount || amount <= 0) {
    showNotification("Please enter valid description and amount", "error");
    return;
  }

  // Create transaction object
  const transaction = {
    id: Date.now(),
    description: description,
    amount: type === "income" ? amount : -amount,
    type: type,
    category: category,
    created_at: new Date().toISOString(),
  };

  // Add to transactions array
  transactions.push(transaction);

  // Save to localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // Update UI
  updateTransactionList();
  updateSummary();

  // Reset form
  transactionFormEl.reset();
  typeIncomeEl.checked = true;

  // Show success notification
  showNotification("Transaction added successfully!", "success");
}

// Update transaction list
function updateTransactionList() {
  transactionListEl.innerHTML = "";

  // Filter transactions based on current filter
  let filteredTransactions = [...transactions];
  if (currentFilter === "income") {
    filteredTransactions = transactions.filter((t) => Number(t.amount) > 0);
  } else if (currentFilter === "expense") {
    filteredTransactions = transactions.filter((t) => Number(t.amount) < 0);
  }

  // Sort by date (newest first)
  const sortedTransactions = [...filteredTransactions].reverse();

  // Display transactions or empty state
  if (sortedTransactions.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
                    <i class="fas fa-receipt"></i>
                    <p>No transactions found</p>
                `;
    transactionListEl.appendChild(emptyState);
    return;
  }

  // Create transaction elements
  sortedTransactions.forEach((transaction) => {
    const tEl = createTransactionElement(transaction);
    transactionListEl.appendChild(tEl);
  });
}

// Create transaction element
function createTransactionElement(transaction) {
  const liEl = document.createElement("li");
  liEl.classList.add("transaction");
  liEl.classList.add(transaction.amount > 0 ? "income" : "expense");

  // Format date
  const date = new Date(transaction.created_at);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Format amount with + or -
  const formattedAmount =
    transaction.amount > 0
      ? `+$${Math.abs(transaction.amount).toFixed(2)}`
      : `-$${Math.abs(transaction.amount).toFixed(2)}`;

  liEl.innerHTML = `
                <div class="transaction-details">
                    <div class="transaction-description">${
                      transaction.description
                    }</div>
                    <div class="transaction-date">${formattedDate} • ${
    transaction.category
  }</div>
                </div>
                <div class="transaction-amount ${
                  transaction.amount > 0 ? "income" : "expense"
                }">
                    ${formattedAmount}
                </div>
                <div class="transaction-actions">
                    <button class="delete-btn" onclick="deleteTransaction(${
                      transaction.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

  return liEl;
}

// Update summary
function updateSummary() {
  // Calculate totals
  const income = transactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expenses = transactions
    .filter((t) => Number(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);

  const balance = income - expenses;

  // Update UI
  balanceEl.textContent = `$${balance.toFixed(2)}`;
  incomeAmountEl.textContent = `$${income.toFixed(2)}`;
  expenseAmountEl.textContent = `$${expenses.toFixed(2)}`;

  // Update balance color based on value
  if (balance < 0) {
    balanceEl.style.color = "var(--expense)";
  } else {
    balanceEl.style.color = "white";
  }
}

// Delete transaction
// eslint-disable-next-line no-unused-vars
function deleteTransaction(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions = transactions.filter((t) => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
    showNotification("Transaction deleted", "success");
  }
}

// Handle filter
function handleFilter(e) {
  const filter = e.target.dataset.filter;

  // Update active filter button
  filterBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.filter === filter) {
      btn.classList.add("active");
    }
  });

  // Update current filter and transaction list
  currentFilter = filter;
  updateTransactionList();
}

// Show notification
function showNotification(message, type) {
  notificationEl.textContent = message;
  notificationEl.className = `notification ${type}`;
  notificationEl.classList.add("show");

  setTimeout(() => {
    notificationEl.classList.remove("show");
  }, 3000);
}

// Initialize the app
init();
