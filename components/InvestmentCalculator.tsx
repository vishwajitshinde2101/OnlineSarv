import React, { useState } from 'react';

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-brand-accent/10 dark:bg-gray-700/50 p-4 rounded-lg text-center shadow flex-1">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
    <p className="text-2xl font-bold text-brand-primary dark:text-brand-accent">{value}</p>
  </div>
);

const InvestmentCalculator: React.FC = () => {
  const [initialAmount, setInitialAmount] = useState('1000');
  const [monthlyContribution, setMonthlyContribution] = useState('100');
  const [interestRate, setInterestRate] = useState('7');
  const [years, setYears] = useState('10');
  const [results, setResults] = useState<{
    futureValue: number;
    totalInvested: number;
    totalInterest: number;
  } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const P = parseFloat(initialAmount);
    const PMT = parseFloat(monthlyContribution);
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(years);

    if (isNaN(P) || isNaN(PMT) || isNaN(r) || isNaN(t) || P < 0 || PMT < 0 || r < 0 || t <= 0) {
      setError('Please enter valid, non-negative numbers for all fields.');
      setResults(null);
      return;
    }
    setError('');

    const n = 12; // Compounded monthly
    const nt = n * t;
    const monthlyRate = r / n;
    
    // Future value of initial principal
    const fvPrincipal = P * Math.pow(1 + monthlyRate, nt);
    
    // Future value of a series (monthly contributions)
    const fvContributions = PMT * ((Math.pow(1 + monthlyRate, nt) - 1) / monthlyRate);
    
    const futureValue = fvPrincipal + fvContributions;
    const totalInvested = P + (PMT * nt);
    const totalInterest = futureValue - totalInvested;

    setResults({ futureValue, totalInvested, totalInterest });
  };
  
  const handleReset = () => {
      setInitialAmount('1000');
      setMonthlyContribution('100');
      setInterestRate('7');
      setYears('10');
      setResults(null);
      setError('');
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">Calculator Inputs</h3>
            <div>
              <label htmlFor="initialAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Amount ($)</label>
              <input type="number" id="initialAmount" value={initialAmount} onChange={(e) => setInitialAmount(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div>
              <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Contribution ($)</label>
              <input type="number" id="monthlyContribution" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Annual Interest Rate (%)</label>
              <input type="number" id="interestRate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div>
              <label htmlFor="years" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Investment Period (Years)</label>
              <input type="number" id="years" value={years} onChange={(e) => setYears(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="flex gap-4">
              <button onClick={handleCalculate} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors">Calculate</button>
              <button onClick={handleReset} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Reset</button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white">Projected Growth</h3>
            {results ? (
              <div className="space-y-4">
                <StatCard value={formatCurrency(results.futureValue)} label="Future Value" />
                <div className="flex flex-col sm:flex-row gap-4">
                  <StatCard value={formatCurrency(results.totalInvested)} label="Total Invested" />
                  <StatCard value={formatCurrency(results.totalInterest)} label="Total Interest Earned" />
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Your investment projection will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;