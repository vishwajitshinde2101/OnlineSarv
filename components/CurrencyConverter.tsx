import React, { useState, useMemo } from 'react';

const rates: { [key: string]: number } = {
  USD: 1,
  EUR: 0.92,
  JPY: 157.25,
  GBP: 0.79,
  AUD: 1.50,
  CAD: 1.37,
  CHF: 0.90,
  CNY: 7.24,
  INR: 83.54,
};
const currencySymbols: { [key: string]: string } = {
  USD: '$', EUR: '€', JPY: '¥', GBP: '£', AUD: 'A$', CAD: 'C$', CHF: 'Fr', CNY: '¥', INR: '₹',
}
const currencyNames = Object.keys(rates);

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const convertedAmount = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    const amountInUSD = numAmount / rates[fromCurrency];
    return amountInUSD * rates[toCurrency];
  }, [amount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (value: number, currency: string) => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    } catch (e) {
        // Fallback for currencies not supported by Intl
        return `${currencySymbols[currency] || ''}${value.toFixed(2)}`;
    }
  };


  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 text-lg"
            />
          </div>
          <div className="flex items-center gap-4">
            {/* From Currency */}
            <div className="flex-1">
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
              <select id="from" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 text-lg">
                {currencyNames.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {/* Swap Button */}
            <button onClick={handleSwapCurrencies} className="mt-6 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-brand-accent hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            </button>
            {/* To Currency */}
            <div className="flex-1">
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
              <select id="to" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 text-lg">
                {currencyNames.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">{formatCurrency(parseFloat(amount) || 0, fromCurrency)} =</p>
            <p className="text-4xl font-bold text-brand-primary dark:text-brand-accent my-2">
                {formatCurrency(convertedAmount, toCurrency)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">1 {fromCurrency} = {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">*Disclaimer: Rates are for informational purposes only and may not be up-to-date.</p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;