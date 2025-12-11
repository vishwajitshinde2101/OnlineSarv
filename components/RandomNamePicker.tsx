import React, { useState, useEffect } from 'react';

const RandomNamePicker: React.FC = () => {
  const [names, setNames] = useState('');
  const [pickedName, setPickedName] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isPicking) {
      const nameList = names.split('\n').filter(n => n.trim() !== '');
      if (nameList.length > 0) {
        interval = window.setInterval(() => {
          const randomIndex = Math.floor(Math.random() * nameList.length);
          setPickedName(nameList[randomIndex]);
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          setIsPicking(false);
        }, 2000); // Animation duration
      } else {
        setIsPicking(false);
        setPickedName(null);
      }
    }
    return () => clearInterval(interval);
  }, [isPicking, names]);

  const handlePick = () => {
    if (!isPicking) {
      setIsPicking(true);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="names" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter names, one per line
          </label>
          <textarea
            id="names"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            className="w-full h-40 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="Alice&#10;Bob&#10;Charlie"
          />
        </div>
        <button
          onClick={handlePick}
          disabled={isPicking || names.trim() === ''}
          className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
        >
          {isPicking ? 'Picking...' : 'Pick a Name'}
        </button>

        <div className="mt-6 text-center">
          <h3 className="text-lg text-gray-600 dark:text-gray-400">The winner is...</h3>
          <div className="p-4 bg-brand-accent/10 dark:bg-gray-700/50 rounded-lg min-h-[80px] flex items-center justify-center mt-2">
            {pickedName && (
              <p className={`text-4xl font-bold text-brand-primary dark:text-brand-accent ${!isPicking ? 'animate-bounce' : ''}`}>
                {pickedName}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomNamePicker;