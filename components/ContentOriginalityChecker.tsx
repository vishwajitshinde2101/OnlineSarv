import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/genai";
import SpinnerIcon from './icons/SpinnerIcon';
import MarkdownPreview from './MarkdownPreview';

const ContentOriginalityChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) {
      setError('Please enter text to check.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');
    
    const prompt = `
Analyze the originality of the following text by checking for common phrases and structures found online. Do not perform a direct plagiarism check, but rather give an "originality score".

Text:
---
${text}
---

Provide the analysis in Markdown format with the following sections:
- **Originality Score:** A percentage score indicating how unique the text feels (e.g., 95% Original).
- **Analysis:** A brief explanation of the score. Mention if the text uses common phrasing or presents ideas in a unique way.
- **Potentially Common Phrases:** List up to 3 phrases that might be generic or commonly found online. If none are found, state that.
`;
    
    try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setResult(text);
    } catch (e: any) {
      setError(e.message || "An error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter Text to Check for Originality</label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article or essay here..."
              className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white min-h-[200px]"
            />
          </div>
          <button onClick={handleCheck} disabled={isLoading} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center">
            {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Checking...</> : 'Check Originality'}
          </button>
        </div>
        
        {(result || error || isLoading) && (
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-white mb-2">Originality Report</h3>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg min-h-[150px]">
                    {isLoading && <div className="flex justify-center items-center h-full"><SpinnerIcon className="w-8 h-8"/></div>}
                    {error && <p className="text-red-500">{error}</p>}
                    {result && <MarkdownPreview markdown={result} />}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ContentOriginalityChecker;