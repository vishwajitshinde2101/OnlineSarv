import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/genai";
import SpinnerIcon from './icons/SpinnerIcon';
import MarkdownPreview from './MarkdownPreview';

const TextSummarizer: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter text to summarize.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');
    
    const prompt = `Summarize the following text into a few key bullet points.

Text:
---
${text}
---

Summary:
`;
    
    try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setResult(text);
    } catch (e: any) {
      setError(e.message || "An error occurred while summarizing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input */}
            <div className="flex flex-col">
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter Text to Summarize</label>
                <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your long article, notes, or document here..."
                className="w-full h-80 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                />
            </div>
            {/* Output */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Generated Summary</label>
                <div className="w-full h-80 p-2 border rounded-md bg-white dark:bg-gray-800 overflow-auto">
                    {isLoading && <div className="flex justify-center items-center h-full"><SpinnerIcon className="w-8 h-8"/></div>}
                    {error && <p className="text-red-500">{error}</p>}
                    {result && <MarkdownPreview markdown={result} />}
                </div>
            </div>
        </div>
        <div className="text-center mt-6">
            <button onClick={handleSummarize} disabled={isLoading || !text} className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center mx-auto disabled:opacity-50">
                {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Summarizing...</> : 'Summarize Text'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TextSummarizer;