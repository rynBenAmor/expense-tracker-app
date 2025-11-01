<template>
  <div class="container">
    <h1>Expense Tracker</h1>

    <div class="balance-container">
      <h2>Your Balance</h2>
      <div
        class="balance-amount"
        :style="{ color: balance < 0 ? 'var(--expense)' : 'white' }"
      >
        {{ formattedBalance }}
      </div>

      <div class="summary">
        <div class="income">
          <h3>Income</h3>
          <p id="income-amount">{{ formattedIncome }}</p>
        </div>
        <div class="expenses">
          <h3>Expenses</h3>
          <p id="expense-amount">{{ formattedExpenses }}</p>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- Transaction List -->
      <div class="transaction-container">
        <div class="transaction-header">
          <h2>Transactions</h2>
          <div class="filter-options">
            <button
              v-for="f in ['all', 'income', 'expense']"
              :key="f"
              :class="['filter-btn', { active: currentFilter === f }]"
              @click="handleFilter(f)"
            >
              {{ f.charAt(0).toUpperCase() + f.slice(1) }}
            </button>
          </div>
        </div>

        <ul id="transaction-list">
          <li v-if="filteredTransactions.length === 0" class="empty-state">
            <i class="fas fa-receipt"></i>
            <p>No transactions found</p>
          </li>

          <li
            v-for="t in sortedTransactions"
            :key="t.id"
            class="transaction"
            :class="t.amount > 0 ? 'income' : 'expense'"
          >
            <div class="transaction-details">
              <div class="transaction-description">{{ t.description }}</div>
              <div class="transaction-date">
                {{ formatDate(t.created_at) }} • {{ t.category }}
              </div>
            </div>
            <div
              class="transaction-amount"
              :class="t.amount > 0 ? 'income' : 'expense'"
            >
              {{ formatAmount(t.amount) }}
            </div>
            <div class="transaction-actions">
              <button class="delete-btn" @click="deleteTransaction(t.id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Add Transaction Form -->
      <div class="form-container">
        <h2>Add Transaction</h2>
        <form @submit.prevent="addTransaction">
          <div class="form-group">
            <label for="description">Description</label>
            <input
              type="text"
              id="description"
              v-model.trim="newTransaction.description"
              placeholder="Enter description"
              required
            />
          </div>

          <div class="form-group">
            <label for="amount">Amount</label>
            <input
              type="number"
              id="amount"
              v-model.number="newTransaction.amount"
              placeholder="Enter the amount"
              step="0.01"
              required
            />
          </div>

          <div class="form-group">
            <label>Type</label>
            <div class="radio-group">
              <label class="radio-option">
                <input
                  type="radio"
                  value="income"
                  v-model="newTransaction.type"
                />
                Income
              </label>
              <label class="radio-option">
                <input
                  type="radio"
                  value="expense"
                  v-model="newTransaction.type"
                />
                Expense
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" v-model="newTransaction.category">
              <option value="general">General</option>
              <option value="salary">Salary</option>
              <option value="freelance">Freelance</option>
              <option value="investment">Investment</option>
              <option value="food">Food & Dining</option>
              <option value="shopping">Shopping</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="bills">Bills & Utilities</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit">Add Transaction</button>
        </form>
      </div>
    </div>

    <!-- Notification -->
    <div class="notification" :class="[notification.type, { show: notification.show }]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpenseTracker",
  data() {
    return {
      transactions: [],
      currentFilter: "all",
      newTransaction: {
        description: "",
        amount: null,
        type: "income",
        category: "general",
      },
      notification: {
        message: "",
        type: "",
        show: false,
      },
    };
  },
  computed: {
    income() {
      return this.transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    },
    expenses() {
      return this.transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    },
    balance() {
      return this.income - this.expenses;
    },
    formattedIncome() {
      return `$${this.income.toFixed(2)}`;
    },
    formattedExpenses() {
      return `$${this.expenses.toFixed(2)}`;
    },
    formattedBalance() {
      return `$${this.balance.toFixed(2)}`;
    },
    filteredTransactions() {
      if (this.currentFilter === "income") {
        return this.transactions.filter((t) => t.amount > 0);
      } else if (this.currentFilter === "expense") {
        return this.transactions.filter((t) => t.amount < 0);
      }
      return this.transactions;
    },
    sortedTransactions() {
      return [...this.filteredTransactions].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    },
  },
  methods: {
    addTransaction() {
      const { description, amount, type, category } = this.newTransaction;

      if (!description || !amount || amount <= 0) {
        this.showNotification("Please enter valid description and amount", "error");
        return;
      }

      const transaction = {
        id: Date.now(),
        description,
        amount: type === "income" ? amount : -amount,
        type,
        category,
        created_at: new Date().toISOString(),
      };

      this.transactions.push(transaction);
      this.saveTransactions();
      this.resetForm();
      this.showNotification("Transaction added successfully!", "success");
    },
    deleteTransaction(id) {
      if (confirm("Are you sure you want to delete this transaction?")) {
        this.transactions = this.transactions.filter((t) => t.id !== id);
        this.saveTransactions();
        this.showNotification("Transaction deleted", "success");
      }
    },
    handleFilter(filter) {
      this.currentFilter = filter;
    },
    saveTransactions() {
      localStorage.setItem("transactions", JSON.stringify(this.transactions));
    },
    loadTransactions() {
      const stored = JSON.parse(localStorage.getItem("transactions")) || [];
      this.transactions = stored.map((t) => ({
        ...t,
        amount: Number(t.amount),
      }));
    },
    resetForm() {
      this.newTransaction = {
        description: "",
        amount: null,
        type: "income",
        category: "general",
      };
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    },
    formatAmount(amount) {
      const sign = amount > 0 ? "+" : "-";
      return `${sign}$${Math.abs(amount).toFixed(2)}`;
    },
    showNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.show = true;
      setTimeout(() => (this.notification.show = false), 3000);
    },
  },
  mounted() {
    this.loadTransactions();
  },
};
</script>

