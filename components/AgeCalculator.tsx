import React, { useState } from 'react';

// Card for primary stats (Age, Next Birthday)
const StatCard = ({ value, label }: { value: string | number; label: string }) => (
  <div className="bg-brand-accent/10 dark:bg-gray-700/50 p-4 rounded-lg text-center shadow">
    <p className="text-3xl font-bold text-brand-primary dark:text-brand-accent">{value}</p>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</p>
  </div>
);

// List item for detailed summary stats
const SummaryItem = ({ value, label }: { value: string; label: string }) => (
    <li className="flex justify-between items-center py-3 px-4 bg-gray-100 dark:bg-gray-800/60 rounded-lg">
      <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
      <span className="font-bold text-gray-800 dark:text-white">{value}</span>
    </li>
);


const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<{ years: number; months: number; days: number; } | null>(null);
  const [nextBirthday, setNextBirthday] = useState<{ months: number; days: number; } | null>(null);
  const [summary, setSummary] = useState<{
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleCalculate = () => {
    if (!dob) {
      setError('Please select your date of birth.');
      setAge(null);
      setNextBirthday(null);
      setSummary(null);
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
      setError('Date of birth cannot be in the future.');
      setAge(null);
      setNextBirthday(null);
      setSummary(null);
      return;
    }

    setError(null);
    
    // Age Calculation
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    setAge({ years, months, days });

    // Summary Calculation
    const totalDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    
    setSummary({
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
    });

    // Next Birthday Calculation
    let nextBirthdayDate = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if(nextBirthdayDate < today) {
      nextBirthdayDate.setFullYear(today.getFullYear() + 1);
    }
    
    let nextBdayMonths = nextBirthdayDate.getMonth() - today.getMonth();
    let nextBdayDays = nextBirthdayDate.getDate() - today.getDate();
    
    if (nextBdayDays < 0) {
        nextBdayMonths--;
        nextBdayDays += new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    }
    if (nextBdayMonths < 0) {
        nextBdayMonths += 12;
    }

    setNextBirthday({ months: nextBdayMonths, days: nextBdayDays });
  };

  const handleReset = () => {
    setDob('');
    setAge(null);
    setNextBirthday(null);
    setSummary(null);
    setError(null);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Calculate Your Age</h3>
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Your Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:text-white"
            max={new Date().toISOString().split("T")[0]} // Prevents future dates
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleCalculate}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
            disabled={!dob}
          >
            Calculate Age
          </button>
          <button
            onClick={handleReset}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Reset
          </button>
        </div>
      </div>
      
      {age && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-4">Your Age Is</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard value={age.years} label="Years" />
            <StatCard value={age.months} label="Months" />
            <StatCard value={age.days} label="Days" />
          </div>
        </div>
      )}

      {summary && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-4">Age Summary</h4>
          <ul className="space-y-2 max-w-sm mx-auto">
              <SummaryItem value={summary.totalMonths.toLocaleString()} label="Total Months" />
              <SummaryItem value={summary.totalWeeks.toLocaleString()} label="Total Weeks" />
              <SummaryItem value={summary.totalDays.toLocaleString()} label="Total Days" />
              <SummaryItem value={summary.totalHours.toLocaleString()} label="Total Hours" />
              <SummaryItem value={summary.totalMinutes.toLocaleString()} label="Total Minutes" />
          </ul>
        </div>
      )}

      {nextBirthday && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-4">Your Next Birthday Is In</h4>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto">
            <StatCard value={nextBirthday.months} label="Months" />
            <StatCard value={nextBirthday.days} label="Days" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;