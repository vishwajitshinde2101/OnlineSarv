import React, { useState } from 'react';

const TimestampConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateString, setDateString] = useState(new Date().toLocaleString());
  const [humanDate, setHumanDate] = useState(new Date().toUTCString());
  
  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const ts = e.target.value;
      setTimestamp(ts);
      const numTs = parseInt(ts, 10);
      if (!isNaN(numTs)) {
          const date = new Date(numTs * 1000);
          setDateString(date.toLocaleString());
          setHumanDate(date.toUTCString());
      }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const ds = e.target.value;
      setDateString(ds);
      const date = new Date(ds);
      if (!isNaN(date.getTime())) {
          setTimestamp(Math.floor(date.getTime() / 1000).toString());
          setHumanDate(date.toUTCString());
      }
  }

  const setCurrentTime = () => {
      const now = new Date();
      setDateString(now.toLocaleString());
      setTimestamp(Math.floor(now.getTime() / 1000).toString());
      setHumanDate(now.toUTCString());
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center">
            <button onClick={setCurrentTime} className="bg-brand-primary text-white py-2 px-4 rounded-md">Use Current Time</button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unix Timestamp (seconds)</label>
          <input type="number" id="timestamp" value={timestamp} onChange={handleTimestampChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <label htmlFor="datestring" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Local Time</label>
          <input type="text" id="datestring" value={dateString} onChange={handleDateChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">UTC Time</label>
          <input type="text" readOnly value={humanDate} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
        </div>
      </div>
    </div>
  );
};

export default TimestampConverter;