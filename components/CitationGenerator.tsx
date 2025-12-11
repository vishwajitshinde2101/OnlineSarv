import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/genai";
import SpinnerIcon from './icons/SpinnerIcon';

const CitationGenerator: React.FC = () => {
  const [source, setSource] = useState('');
  const [style, setStyle] = useState('APA');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!source.trim()) {
      setError('Please enter a source to cite.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');
    
    const prompt = `Generate a citation for the following source in ${style} format. Source: "${source}"`;
    
    try {
        const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setResult(text);
    } catch (e: any) {
      setError(e.message || "An error occurred while generating the citation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source (URL, Book Title, etc.)</label>
            <textarea
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., https://www.example.com/article or 'The Great Gatsby' by F. Scott Fitzgerald"
              className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[100px]"
            />
          </div>
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Citation Style</label>
            <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600">
              <option>APA</option>
              <option>MLA</option>
              <option>Chicago</option>
            </select>
          </div>
          <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
            {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Generating...</> : 'Generate Citation'}
          </button>
        </div>
        
        {(result || error) && (
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-white mb-2">Generated Citation</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-h-[80px]">
                    {error ? <p className="text-red-500">{error}</p> : <p className="text-gray-700 dark:text-gray-300">{result}</p>}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CitationGenerator;