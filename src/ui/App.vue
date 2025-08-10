<template>
  <div class="app container py-4">
    <header class="text-center mb-4">
      <h1 class="display-5 fw-bold text-primary">
        <i class="fas fa-wallet me-2"></i>My Expense Tracker
      </h1>
    </header>

    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <div class="card text-white bg-success h-100">
          <div class="card-body">
            <h5 class="card-title">Income</h5>
            <p class="card-text display-6">{{ formatCurrency(totalIncome) }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card text-white bg-danger h-100">
          <div class="card-body">
            <h5 class="card-title">Expenses</h5>
            <p class="card-text display-6">{{ formatCurrency(totalExpenses) }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card text-white bg-primary h-100">
          <div class="card-body">
            <h5 class="card-title">Balance</h5>
            <p class="card-text display-6">{{ formatCurrency(balance) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Transaction -->
    <div class="card mb-4">
      <div class="card-header bg-light">
        <h5 class="mb-0">
          <i class="fas fa-plus-circle me-2"></i>Add Transaction
        </h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="addTransaction" class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Type</label>
            <div class="input-group">
              <span class="input-group-text">
                <i :class="form.type === 'income' ? 'fas fa-money-bill-wave' : 'fas fa-shopping-cart'"></i>
              </span>
              <select v-model="form.type" class="form-select" required>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div class="col-md-3">
            <label class="form-label">Amount</label>
            <div class="input-group">
              <span class="input-group-text">TND</span>
              <input type="number" step="0.100" v-model.number="form.amount" class="form-control" placeholder="0.000"
                required>
            </div>
          </div>

          <div class="col-md-3">
            <label class="form-label">Category</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-tag"></i></span>
              <select v-model="form.category" class="form-select" required>
                <option value="" disabled selected>Select category</option>
                <option v-for="cat in categories" :value="cat" :key="cat">{{ cat }}</option>
              </select>
            </div>
          </div>

          <div class="col-md-3">
            <label class="form-label">Date</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-calendar"></i></span>
              <input type="date" v-model="form.date" class="form-control" required>
            </div>
          </div>

          <div class="col-12">
            <label class="form-label">Notes</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-comment"></i></span>
              <input type="text" v-model="form.notes" class="form-control" placeholder="Optional notes">
            </div>
          </div>

          <div class="col-12">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save me-2"></i>Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="card">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="fas fa-list me-2"></i>Transaction History
        </h5>
        <div class="input-group w-auto">
          <span class="input-group-text"><i class="fas fa-search"></i></span>
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search...">
        </div>
      </div>
      <div class="card-body p-0">
        <ul class="list-group list-group-flush">
          <li v-for="t in filteredTransactions" :key="t.id"
            class="list-group-item d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <div class="me-3" :class="t.type === 'income' ? 'text-success' : 'text-danger'">
                <i :class="t.type === 'income' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              </div>
              <div>
                <h6 class="mb-0">{{ t.category }}</h6>
                <small class="text-muted">{{ formatDate(t.date) }} • {{ t.notes }}</small>
              </div>
            </div>
            <div class="text-end">
              <span :class="t.type === 'income' ? 'text-success' : 'text-danger'">
                {{ t.type === 'income' ? '+' : '-' }}{{ formatCurrency(t.amount) }}
              </span>
              <button @click="deleteTransaction(t.id)" class="btn btn-sm btn-link text-danger ms-2">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="filteredTransactions.length === 0" class="card-body text-center text-muted">
        <i class="fas fa-inbox fa-3x mb-3"></i>
        <p>No transactions found</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      transactions: [],
      searchQuery: '',
      form: {
        type: "expense",
        amount: null,
        category: "",
        date: new Date().toISOString().split('T')[0],
        notes: ""
      },
      categories: [
        "Salary", "Allowance", "Freelance", "Investment", "Gift",
        "Food", "Transport", "Housing", "Entertainment",
        "Shopping", "Healthcare", "Education", "Other"
      ],
    }
  },
  computed: {
    totalIncome() {
      return this.transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    },
    totalExpenses() {
      return this.transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
    },
    balance() {
      return this.totalIncome - this.totalExpenses;
    },
    filteredTransactions() {
      const query = this.searchQuery.toLowerCase().trim();
      return this.transactions.filter(t =>
        t.category.toLowerCase().includes(query) ||
        t.notes.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
      ).sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },
  mounted() {
    this.loadTransactions();
  },
  methods: {
    loadTransactions() {
      const saved = localStorage.getItem("transactions");
      if (saved) this.transactions = JSON.parse(saved);
    },
    addTransaction() {
      const newTransaction = {
        id: Date.now(),
        type: this.form.type,
        amount: parseFloat(this.form.amount).toFixed(3),
        category: this.form.category,
        date: this.form.date,
        notes: this.form.notes
      };

      this.transactions.unshift(newTransaction);
      this.saveTransactions();

      // Reset form but keep type and date
      this.form.amount = null;
      this.form.category = "";
      this.form.notes = "";
    },
    deleteTransaction(id) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.saveTransactions();
    },
    saveTransactions() {
      localStorage.setItem("transactions", JSON.stringify(this.transactions));
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "TND"
      }).format(value);
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  }
};
</script>


<style scoped>
.app {
  max-width: 1200px;
}

.list-group-item {
  transition: all 0.2s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.input-group-text {
  min-width: 40px;
  justify-content: center;
}

.card-header {
  padding: 0.75rem 1.25rem;
}

@media (max-width: 768px) {
  .card-text.display-6 {
    font-size: 1.5rem;
  }
}
</style>
