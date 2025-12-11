import React, { useState } from 'react';

const TipCalculator: React.FC = () => {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState('15');
  const [people, setPeople] = useState('1');

  const numBill = parseFloat(bill);
  const numTipPercent = parseInt(tipPercent, 10);
  const numPeople = parseInt(people, 10);

  const tipAmount = (numBill * (numTipPercent / 100)) || 0;
  const totalAmount = numBill + tipAmount || 0;
  const amountPerPerson = (numPeople > 0 ? totalAmount / numPeople : 0) || 0;
  const tipPerPerson = (numPeople > 0 ? tipAmount / numPeople : 0) || 0;

  const handleReset = () => {
    setBill('');
    setTipPercent('15');
    setPeople('1');
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="bill" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bill Amount</label>
            <input type="number" id="bill" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="0.00" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 text-lg" />
          </div>
          <div>
            <label htmlFor="tip" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tip Percentage: {tipPercent}%</label>
            <input type="range" id="tip" min="0" max="100" step="1" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} className="w-full mt-1" />
          </div>
          <div>
            <label htmlFor="people" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of People</label>
            <input type="number" id="people" value={people} onChange={(e) => setPeople(e.target.value)} min="1" step="1" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 text-lg" />
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-brand-primary dark:bg-neutral-dark p-6 rounded-lg text-white flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <div>
                <p>Tip Amount</p>
                <p className="text-xs text-gray-300">/ person</p>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(tipPerPerson)}</p>
            </div>
            <div className="flex justify-between items-baseline">
              <div>
                <p>Total</p>
                <p className="text-xs text-gray-300">/ person</p>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(amountPerPerson)}</p>
            </div>
             <hr className="border-brand-secondary/50"/>
             <div className="flex justify-between items-baseline font-bold">
                <p>Total Bill</p>
                <p className="text-3xl">{formatCurrency(totalAmount)}</p>
             </div>
          </div>
          <button onClick={handleReset} className="w-full mt-6 bg-brand-accent hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipCalculator;