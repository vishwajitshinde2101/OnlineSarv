import React, { useState, useEffect, useRef } from 'react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const timeSettings = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (time < 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsActive(false);
      alert('Time is up!'); // Simple notification
      // A more advanced version could play a sound
      switchMode(mode === 'pomodoro' ? 'shortBreak' : 'pomodoro');
    }
  }, [time, mode]);

  const switchMode = (newMode: TimerMode) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setMode(newMode);
    setTime(timeSettings[newMode]);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setTime(timeSettings[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = (time / timeSettings[mode]) * 100;

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center gap-2 mb-8">
          <button onClick={() => switchMode('pomodoro')} className={`px-4 py-2 rounded-md ${mode === 'pomodoro' ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Pomodoro</button>
          <button onClick={() => switchMode('shortBreak')} className={`px-4 py-2 rounded-md ${mode === 'shortBreak' ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Short Break</button>
          <button onClick={() => switchMode('longBreak')} className={`px-4 py-2 rounded-md ${mode === 'longBreak' ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Long Break</button>
        </div>

        <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-300 dark:text-gray-700" strokeWidth="5" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle
                    className="text-brand-primary dark:text-brand-accent"
                    strokeWidth="5"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={(2 * Math.PI * 45) * (1 - progress / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-gray-800 dark:text-white">{formatTime(time)}</span>
            </div>
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={toggleTimer} className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-10 rounded-lg text-xl">
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetTimer} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-10 rounded-lg text-xl">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;