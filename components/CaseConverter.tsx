import React, { useState } from 'react';

const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const toUpperCase = () => setText(text.toUpperCase());
  const toLowerCase = () => setText(text.toLowerCase());
  const toTitleCase = () => setText(text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
  const toSentenceCase = () => setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()));
  
  const handleCopy = () => {
      if(text) {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };
  
  const handleClear = () => setText('');

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-2xl mx-auto">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-48 p-4 border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 mb-4"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <button onClick={toUpperCase} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-brand-accent/50">UPPERCASE</button>
          <button onClick={toLowerCase} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-brand-accent/50">lowercase</button>
          <button onClick={toTitleCase} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-brand-accent/50">Title Case</button>
          <button onClick={toSentenceCase} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-brand-accent/50">Sentence case</button>
        </div>
        <div className="flex gap-2 justify-center">
            <button onClick={handleCopy} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">
                {copied ? 'Copied!' : 'Copy Text'}
            </button>
             <button onClick={handleClear} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg">Clear</button>
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;