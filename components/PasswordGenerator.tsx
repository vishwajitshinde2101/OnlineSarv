import React, { useState, useEffect } from 'react';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let charset = '';
    if (includeUppercase) charset += upper;
    if (includeLowercase) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    
    if (charset === '') {
        setPassword('');
        return;
    };

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setCopied(false);
  };
  
  // Generate a password on initial render and when options change
  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const CheckboxOption = ({label, checked, onChange}: {label: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => (
      <label className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md cursor-pointer">
          <input type="checkbox" checked={checked} onChange={onChange} className="w-5 h-5 rounded text-brand-primary focus:ring-brand-accent"/>
          <span className="text-gray-700 dark:text-gray-300">{label}</span>
      </label>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Generate a Secure Password</h3>
        <div className="relative mb-6">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full p-4 pr-24 text-lg font-mono bg-white dark:bg-gray-800 rounded-md border dark:border-gray-600"
          />
          <button onClick={handleCopy} className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-r-md">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Length: {length}</label>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CheckboxOption label="Include Uppercase" checked={includeUppercase} onChange={e => setIncludeUppercase(e.target.checked)} />
              <CheckboxOption label="Include Lowercase" checked={includeLowercase} onChange={e => setIncludeLowercase(e.target.checked)} />
              <CheckboxOption label="Include Numbers" checked={includeNumbers} onChange={e => setIncludeNumbers(e.target.checked)} />
              <CheckboxOption label="Include Symbols" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} />
          </div>
          <button onClick={generatePassword} className="w-full mt-4 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg">
            Generate New Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;