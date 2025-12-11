import React, { useState, useMemo } from 'react';

const timeZones = [
  'UTC', 'GMT', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 
  'Europe/Paris', 'Asia/Tokyo', 'Asia/Dubai', 'Asia/Kolkata', 'Australia/Sydney'
];

const TimeZoneConverter: React.FC = () => {
  const [fromZone, setFromZone] = useState('America/New_York');
  const [toZone, setToZone] = useState('Europe/London');
  // Initialize with current date and time
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));

  const convertedDateTime = useMemo(() => {
    try {
      if (!dateTime) return 'Select a date and time';

      const date = new Date(dateTime);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true, timeZone: toZone
      };
      
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (e) {
      return 'Invalid date or timezone';
    }
  }, [dateTime, toZone]);
  
  const fromDateTimeFormatted = useMemo(() => {
      try {
          if(!dateTime) return '';
          const date = new Date(dateTime);
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
            hour12: true
          };
          return new Intl.DateTimeFormat('en-US', options).format(date);
      } catch (e) {
          return 'Invalid Date';
      }
  }, [dateTime]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date and Time</label>
            <input
              type="datetime-local"
              id="datetime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 text-lg"
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="fromZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Timezone</label>
              <select id="fromZone" value={fromZone} onChange={(e) => setFromZone(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600">
                {timeZones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
             <div className="text-2xl text-gray-400 dark:text-gray-500 pb-2">&rarr;</div>
            <div className="flex-1">
              <label htmlFor="toZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">To Timezone</label>
              <select id="toZone" value={toZone} onChange={(e) => setToZone(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600">
                {timeZones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center bg-brand-accent/10 dark:bg-gray-700/50 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">{fromDateTimeFormatted} in {fromZone} is</p>
            <p className="text-3xl font-bold text-brand-primary dark:text-brand-accent my-2">
                {convertedDateTime}
            </p>
            <p className="text-gray-600 dark:text-gray-400">in {toZone}</p>
        </div>
      </div>
    </div>
  );
};

export default TimeZoneConverter;