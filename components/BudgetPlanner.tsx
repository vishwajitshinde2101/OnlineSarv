import React, { useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';

interface BudgetItem {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: number;
}

const STORAGE_KEY = 'budgetPlannerData';

const BudgetPlanner: React.FC = () => {
  const [items, setItems] = useState<BudgetItem[]>(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      return [];
    }
  });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!description || isNaN(numAmount) || numAmount <= 0) return;

    const newItem: BudgetItem = {
      id: Date.now(),
      type,
      description,
      amount: numAmount,
    };

    setItems([...items, newItem]);
    setDescription('');
    setAmount('');
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleReset = () => {
    setItems([]);
  };

  const totalIncome = items.filter(i => i.type === 'income').reduce((acc, i) => acc + i.amount, 0);
  const totalExpenses = items.filter(i => i.type === 'expense').reduce((acc, i) => acc + i.amount, 0);
  const balance = totalIncome - totalExpenses;
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-4xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Total Income</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Balance</h3>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(balance)}</p>
          </div>
        </div>

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4">
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full sm:w-auto px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="flex-grow w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" required/>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="w-full sm:w-32 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" min="0.01" step="0.01" required/>
          <button type="submit" className="w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors">Add Item</button>
        </form>

        {/* Item Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">Income</h3>
            <ul className="space-y-2">{items.filter(i => i.type === 'income').map(item => <BudgetItemRow key={item.id} item={item} onDelete={handleDeleteItem} />)}</ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">Expenses</h3>
            <ul className="space-y-2">{items.filter(i => i.type === 'expense').map(item => <BudgetItemRow key={item.id} item={item} onDelete={handleDeleteItem} />)}</ul>
          </div>
        </div>
        {items.length > 0 && <div className="text-center mt-8">
             <button onClick={handleReset} className="text-sm text-gray-500 hover:text-red-600 dark:hover:text-red-500 font-semibold">Clear All Data</button>
        </div>}
      </div>
    </div>
  );
};

const BudgetItemRow = ({ item, onDelete }: { item: BudgetItem, onDelete: (id: number) => void}) => (
    <li className={`flex justify-between items-center p-3 rounded-lg ${item.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
        <span className="text-gray-800 dark:text-gray-200">{item.description}</span>
        <div className="flex items-center gap-4">
            <span className={`font-semibold ${item.type === 'income' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.amount)}</span>
            <button onClick={() => onDelete(item.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"><CloseIcon className="w-4 h-4" /></button>
        </div>
    </li>
)

export default BudgetPlanner;