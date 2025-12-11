import React, { useState } from 'react';

type Units = 'metric' | 'imperial';
type BmiCategory = 'Underweight' | 'Normal weight' | 'Overweight' | 'Obesity';

interface BmiResult {
  score: number;
  category: BmiCategory;
}

const BMICalculator: React.FC = () => {
  const [units, setUnits] = useState<Units>('metric');
  
  // Metric states
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  
  // Imperial states
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  
  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState('');

  const calculateBmi = () => {
    setError('');
    let bmi = 0;

    if (units === 'metric') {
      const height = parseFloat(heightCm);
      const weight = parseFloat(weightKg);
      if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        setError('Please enter valid positive numbers for height and weight.');
        return;
      }
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const weight = parseFloat(weightLbs);
      const totalHeightInInches = ft * 12 + inch;
      if (isNaN(weight) || totalHeightInInches <= 0 || weight <= 0) {
        setError('Please enter valid positive numbers for height and weight.');
        return;
      }
      bmi = (weight / (totalHeightInInches * totalHeightInInches)) * 703;
    }

    let category: BmiCategory;
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 18.5 && bmi <= 24.9) category = 'Normal weight';
    else if (bmi >= 25 && bmi <= 29.9) category = 'Overweight';
    else category = 'Obesity';

    setResult({ score: bmi, category });
  };
  
  const handleReset = () => {
    setHeightCm('');
    setWeightKg('');
    setHeightFt('');
    setHeightIn('');
    setWeightLbs('');
    setResult(null);
    setError('');
  }
  
  const getCategoryStyle = (category: BmiCategory) => {
    switch (category) {
        case 'Underweight': return 'bg-blue-500 text-white';
        case 'Normal weight': return 'bg-green-500 text-white';
        case 'Overweight': return 'bg-yellow-500 text-black';
        case 'Obesity': return 'bg-red-500 text-white';
    }
  }

  const getPointerPosition = (score: number): string => {
    if (score < 16) return '2%';
    if (score > 35) return '98%';
    // Scale position between 16 and 35
    const percentage = ((score - 16) / (35 - 16)) * 100;
    return `${percentage}%`;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-2xl mx-auto">
        {/* Unit Toggle */}
        <div className="flex justify-center gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6">
          <button onClick={() => { setUnits('metric'); handleReset(); }} className={`flex-1 py-2 rounded-md transition-colors ${units === 'metric' ? 'bg-brand-primary text-white' : 'bg-transparent text-gray-700 dark:text-gray-300'}`}>Metric (kg/cm)</button>
          <button onClick={() => { setUnits('imperial'); handleReset(); }} className={`flex-1 py-2 rounded-md transition-colors ${units === 'imperial' ? 'bg-brand-primary text-white' : 'bg-transparent text-gray-700 dark:text-gray-300'}`}>Imperial (lbs/ft/in)</button>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
          {units === 'metric' ? (
            <>
              <div>
                <label htmlFor="heightCm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
                <input type="number" id="heightCm" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white" placeholder="e.g., 175" />
              </div>
              <div>
                <label htmlFor="weightKg" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
                <input type="number" id="weightKg" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white" placeholder="e.g., 70" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height</label>
                <div className="flex gap-4 mt-1">
                  <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white" placeholder="feet" />
                  <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white" placeholder="inches" />
                </div>
              </div>
              <div>
                <label htmlFor="weightLbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (lbs)</label>
                <input type="number" id="weightLbs" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white" placeholder="e.g., 154" />
              </div>
            </>
          )}
           {error && <p className="text-red-500 text-sm text-center">{error}</p>}
           <div className="flex gap-4 pt-2">
              <button onClick={calculateBmi} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors">Calculate BMI</button>
              <button onClick={handleReset} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Reset</button>
            </div>
        </div>

        {/* Results */}
        {result && (
            <div className="mt-8 text-center">
                <p className="text-lg text-gray-600 dark:text-gray-400">Your BMI is</p>
                <p className="text-5xl font-extrabold text-gray-800 dark:text-white my-2">{result.score.toFixed(1)}</p>
                <div className={`inline-block px-4 py-1 rounded-full text-lg font-semibold ${getCategoryStyle(result.category)}`}>
                    {result.category}
                </div>
                <div className="mt-6">
                    <div className="relative w-full h-8 rounded-full overflow-hidden flex text-white text-xs items-center font-bold">
                        <div className="w-[25%] h-full bg-blue-500 flex items-center justify-center">{'<18.5'}</div>
                        <div className="w-[35%] h-full bg-green-500 flex items-center justify-center">18.5-24.9</div>
                        <div className="w-[20%] h-full bg-yellow-500 flex items-center justify-center text-black">25-29.9</div>
                        <div className="w-[20%] h-full bg-red-500 flex items-center justify-center">{'>30'}</div>
                        <div className="absolute top-0 h-full w-1 bg-gray-800 dark:bg-white" style={{ left: getPointerPosition(result.score) }}>
                            <div className="absolute -top-2 -left-1 w-3 h-3 border-2 border-gray-800 dark:border-white bg-gray-50 dark:bg-gray-900 rotate-45"></div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default BMICalculator;
