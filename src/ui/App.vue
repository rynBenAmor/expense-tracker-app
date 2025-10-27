<template>
  <div class="container">
    <h1>Expense Tracker</h1>

    <div class="balance-container">
      <h2>Your Balance</h2>
      <div class="balance-amount">$0.00</div>
      <div class="summary">
        <div class="income">
          <h3>Income</h3>
          <p id="income-amount">$0.00</p>
        </div>
        <div class="expenses">
          <h3>Expenses</h3>
          <p id="expense-amount">$0.00</p>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="transaction-container">
        <div class="transaction-header">
          <h2>Transactions</h2>
          <div class="filter-options">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="income">Income</button>
            <button class="filter-btn" data-filter="expense">Expense</button>
          </div>
        </div>
        <ul id="transaction-list">
          <!-- Transactions will be added here dynamically -->
          <li></li>
        </ul>
      </div>

      <div class="form-container">
        <h2>Add Transaction</h2>
        <form id="transaction-form">
          <div class="form-group">
            <label for="description">Description</label>
            <input type="text" id="description" placeholder="Enter description" required>
          </div>

          <div class="form-group">
            <label for="amount">Amount</label>
            <input type="number" id="amount" placeholder="Enter the amount" step="0.01" required>
          </div>

          <div class="form-group">
            <label>Type</label>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="income-type" name="type" value="income" checked>
                <label for="income-type">Income</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="expense-type" name="type" value="expense">
                <label for="expense-type">Expense</label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select id="category">
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
  </div>
  <div class="notification" id="notification"></div>
</template>

<script>
export default {
  name: 'App',

  /*   data(){
      return{
        transactions: [],
  
      }
    },
  
    methods:{
      getTransactions(){
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      },
      addTransaction(){
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.querySelector('input[name="type"]:checked').value;
        const category = document.getElementById('category').value;
  
        const newTransaction = {
          id: Date.now(),
          description,
          amount,
          type,
          category,
          date: new Date().toISOString()
        };
  
        this.transactions.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
  
        // Clear form
        document.getElementById('transaction-form').reset();
  
        // Refresh transactions
        this.getTransactions();
      }
    },
    mounted(){
      this.getTransactions();
    }
   */
}

</script>