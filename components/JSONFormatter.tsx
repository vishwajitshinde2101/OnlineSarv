import React, { useState } from 'react';

const JSONFormatter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setFormattedJson('');
    }
  };
  
  const handleCopy = () => {
      if(formattedJson) {
          navigator.clipboard.writeText(formattedJson);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[70vh]">
        {/* Input */}
        <div className="flex flex-col">
            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste your JSON here...'
                className="flex-grow w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white font-mono"
            />
             <button onClick={handleFormat} className="mt-2 bg-brand-primary text-white p-2 rounded-md">Format</button>
        </div>
        {/* Output */}
        <div className="flex flex-col">
            <textarea
                readOnly
                value={error || formattedJson}
                className={`flex-grow w-full p-2 border rounded-md dark:bg-gray-800 font-mono ${error ? 'text-red-500' : 'dark:text-white'}`}
            />
            <button onClick={handleCopy} disabled={!formattedJson} className="mt-2 bg-green-600 text-white p-2 rounded-md disabled:opacity-50">
                {copied ? 'Copied!' : 'Copy Formatted JSON'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;