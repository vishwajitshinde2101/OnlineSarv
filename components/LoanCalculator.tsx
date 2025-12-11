import React, { useState } from 'react';

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-brand-accent/10 dark:bg-gray-700/50 p-4 rounded-lg text-center shadow flex-1">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
    <p className="text-2xl font-bold text-brand-primary dark:text-brand-accent">{value}</p>
  </div>
);

interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

const LoanCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('100000');
  const [interestRate, setInterestRate] = useState('5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [results, setResults] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    amortizationSchedule: AmortizationEntry[];
  } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const p = parseFloat(principal);
    const rate = parseFloat(interestRate);
    const term = parseFloat(loanTerm);

    if (isNaN(p) || isNaN(rate) || isNaN(term) || p <= 0 || rate < 0 || term <= 0) {
      setError('Please enter valid, positive numbers for all fields.');
      setResults(null);
      return;
    }
    setError('');

    const monthlyInterestRate = rate / 100 / 12;
    const numberOfPayments = term * 12;

    if (monthlyInterestRate === 0) { // Handle 0% interest rate
        const monthlyPayment = p / numberOfPayments;
        const totalPayment = p;
        const totalInterest = 0;

        let balance = p;
        const schedule = Array.from({ length: numberOfPayments }, (_, i) => {
            balance -= monthlyPayment;
            return {
                month: i + 1,
                payment: monthlyPayment,
                principal: monthlyPayment,
                interest: 0,
                remainingBalance: balance < 0 ? 0 : balance,
            };
        });

        setResults({
            monthlyPayment,
            totalPayment,
            totalInterest,
            amortizationSchedule: schedule,
        });
        return;
    }


    const monthlyPayment =
      (p * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - p;

    // Generate Amortization Schedule
    let balance = p;
    const schedule: AmortizationEntry[] = [];
    for (let i = 1; i <= numberOfPayments; i++) {
        const interestForMonth = balance * monthlyInterestRate;
        const principalForMonth = monthlyPayment - interestForMonth;
        balance -= principalForMonth;
        schedule.push({
            month: i,
            payment: monthlyPayment,
            principal: principalForMonth,
            interest: interestForMonth,
            remainingBalance: balance < 0 ? 0 : balance, // Prevent negative balance due to float precision
        });
    }

    setResults({
      monthlyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule: schedule,
    });
  };

  const handleReset = () => {
    setPrincipal('100000');
    setInterestRate('5');
    setLoanTerm('30');
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
            <div>
              <label htmlFor="principal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Loan Amount ($)
              </label>
              <input
                type="number"
                id="principal"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 250000"
              />
            </div>
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                id="interestRate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 3.5"
              />
            </div>
            <div>
              <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Loan Term (Years)
              </label>
              <input
                type="number"
                id="loanTerm"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 30"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="flex gap-4">
              <button onClick={handleCalculate} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Calculate
              </button>
              <button onClick={handleReset} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Reset
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white">Your Results</h3>
            {results ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <StatCard value={formatCurrency(results.monthlyPayment)} label="Monthly Payment" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <StatCard value={formatCurrency(results.totalInterest)} label="Total Interest Paid" />
                    <StatCard value={formatCurrency(results.totalPayment)} label="Total Payment" />
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Your loan summary will appear here.</p>
              </div>
            )}
          </div>
        </div>
        
        {results && (
            <div className="mt-8">
                 <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">Amortization Schedule</h3>
                 <div className="max-h-96 overflow-auto bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                         <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                             <tr>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Month</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Principal</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Interest</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Balance</th>
                             </tr>
                         </thead>
                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                             {results.amortizationSchedule.map(entry => (
                                 <tr key={entry.month}>
                                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{entry.month}</td>
                                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatCurrency(entry.principal)}</td>
                                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatCurrency(entry.interest)}</td>
                                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatCurrency(entry.remainingBalance)}</td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
