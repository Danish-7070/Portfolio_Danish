// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoURI = 'mongodb+srv://dani:123@cluster0.jy4zzk1.mongodb.net/expense-manager?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// API Endpoints

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// Create a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: 'Error creating transaction' });
  }
});

// Get summary (income, expenses, balance)
app.get('/api/summary', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    
    res.json({ totalIncome: income, totalExpenses: expenses, balance });
  } catch (error) {
    res.status(500).json({ error: 'Error calculating summary' });
  }
});

// Initialize with mock data (run once)
const initializeData = async () => {
  const count = await Transaction.countDocuments();
  if (count === 0) {
    const mockTransactions = [
      { category: 'PayPal', date: 'Today', amount: 500, type: 'income' },
      { category: 'Mastercard', date: 'Today', amount: 693, type: 'expense' },
      { category: 'Visa', date: '1 Mar 2021', amount: 200, type: 'expense' },
      { category: 'Axcess', date: '23 Mar 2021', amount: 50, type: 'expense' },
      { category: 'Amex', date: '1 Apr 2021', amount: 60, type: 'income' },
      { category: 'Skrill', date: '5 Apr 2021', amount: 20, type: 'income' },
      { category: 'Troy', date: '24 May 2021', amount: 250, type: 'expense' },
      { category: 'Bitpay', date: '25 May 2021', amount: 90, type: 'expense' },
      { category: 'Bitcoin', date: '30 Jun 2021', amount: 1020, type: 'income' },
      { category: 'Good Card', date: '1 Jul 2021', amount: 96, type: 'expense' },
    ];
    await Transaction.insertMany(mockTransactions);
    console.log('Mock data inserted');
  }
};

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeData();
});