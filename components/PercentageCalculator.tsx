import React, { useState, useMemo } from 'react';

type CalcMode = 'percentOf' | 'isWhatPercent' | 'change';

const PercentageCalculator: React.FC = () => {
  const [mode, setMode] = useState<CalcMode>('percentOf');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');

  const handleReset = () => {
    setVal1('');
    setVal2('');
  };
  
  const result = useMemo(() => {
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);

    if (isNaN(num1) || isNaN(num2)) {
      return null;
    }
    
    try {
        switch (mode) {
        case 'percentOf':
            return (num1 / 100) * num2;
        case 'isWhatPercent':
            if (num2 === 0) return 'Cannot divide by zero';
            return (num1 / num2) * 100;
        case 'change':
            if (num1 === 0) return 'Cannot calculate change from zero';
            const change = ((num2 - num1) / num1) * 100;
            const prefix = change >= 0 ? 'Increase of' : 'Decrease of';
            return `${prefix} ${Math.abs(change).toFixed(2)}%`;
        default:
            return null;
        }
    } catch (e) {
        return "Error in calculation";
    }
  }, [val1, val2, mode]);

  const renderInputs = () => {
    const commonInputClass = "w-full text-center px-3 py-2 text-lg border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white";
    
    switch (mode) {
      case 'percentOf':
        return (
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className={commonInputClass} placeholder="X" />
            <span className="text-lg font-medium text-gray-600 dark:text-gray-400">% of</span>
            <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} className={commonInputClass} placeholder="Y" />
          </div>
        );
      case 'isWhatPercent':
        return (
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className={commonInputClass} placeholder="X" />
            <span className="text-lg font-medium text-gray-600 dark:text-gray-400">is what % of</span>
            <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} className={commonInputClass} placeholder="Y" />
          </div>
        );
      case 'change':
        return (
          <div className="flex items-center justify-center gap-2 sm:gap-4">
             <span className="text-lg font-medium text-gray-600 dark:text-gray-400">From</span>
            <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className={commonInputClass} placeholder="Old Value" />
            <span className="text-lg font-medium text-gray-600 dark:text-gray-400">to</span>
            <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} className={commonInputClass} placeholder="New Value" />
          </div>
        );
    }
  };

  const TabButton = ({ calcMode, label }: { calcMode: CalcMode, label: string }) => (
      <button
        onClick={() => { setMode(calcMode); handleReset(); }}
        className={`flex-1 px-2 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
            mode === calcMode
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        >
        {label}
    </button>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-xl mx-auto">
        <div className="flex gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6">
            <TabButton calcMode="percentOf" label="X% of Y" />
            <TabButton calcMode="isWhatPercent" label="X is what % of Y" />
            <TabButton calcMode="change" label="% Change" />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {renderInputs()}
        </div>

        <div className="mt-6 text-center">
            <h3 className="text-lg text-gray-600 dark:text-gray-400 mb-2">Result</h3>
            <div className="p-4 bg-brand-accent/10 dark:bg-gray-700/50 rounded-lg min-h-[72px] flex items-center justify-center">
                {result !== null ? (
                    typeof result === 'number' ? (
                        <p className="text-4xl font-bold text-brand-primary dark:text-brand-accent">
                            {Number.isInteger(result) ? result : result.toFixed(2)}
                        </p>
                    ) : (
                        <p className="text-2xl font-bold text-brand-primary dark:text-brand-accent">{result}</p>
                    )
                ) : (
                    <p className="text-gray-400 dark:text-gray-500">Enter values to calculate.</p>
                )}
            </div>
        </div>

         <div className="mt-4 text-center">
             <button onClick={handleReset} className="text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent font-semibold transition-colors text-sm">
                Reset
             </button>
         </div>

      </div>
    </div>
  );
};

export default PercentageCalculator;
