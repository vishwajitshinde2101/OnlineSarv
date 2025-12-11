import React, { useState } from 'react';

const Base64EncodeDecode: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      setOutput(btoa(input));
      setError('');
    } catch (e: any) {
      setError(`Error encoding: ${e.message}`);
      setOutput('');
    }
  };

  const handleDecode = () => {
    try {
      setOutput(atob(input));
      setError('');
    } catch (e: any) {
      setError(`Invalid Base64 string: ${e.message}`);
      setOutput('');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-2xl mx-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode or decode"
          className="w-full h-32 p-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4"
        />
        <div className="flex gap-4 mb-4">
          <button onClick={handleEncode} className="flex-1 p-2 bg-brand-primary text-white rounded-md">Encode</button>
          <button onClick={handleDecode} className="flex-1 p-2 bg-brand-secondary text-white rounded-md">Decode</button>
        </div>
        <textarea
          readOnly
          value={error || output}
          className={`w-full h-32 p-2 border rounded-md dark:bg-gray-800 ${error ? 'text-red-500' : 'dark:text-white'}`}
        />
      </div>
    </div>
  );
};

export default Base64EncodeDecode;