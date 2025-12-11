import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/genai";
import SpinnerIcon from './icons/SpinnerIcon';
import MarkdownPreview from './MarkdownPreview';

const HeadlineAnalyzer: React.FC = () => {
  const [headline, setHeadline] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!headline.trim()) {
      setError('Please enter a headline to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');
    
    const prompt = `
Analyze the following headline and provide feedback. Headline: "${headline}"

Provide the analysis in Markdown format with the following sections:
- **Overall Score:** A score out of 100, with a brief justification.
- **Strengths:** 2-3 bullet points on what makes the headline effective.
- **Areas for Improvement:** 2-3 bullet points on how it could be better.
- **Suggestions:** Provide 3 alternative, improved headlines.
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter Headline</label>
            <input
              type="text"
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g., 10 Ways to Improve Your Productivity"
              className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center">
            {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Analyzing...</> : 'Analyze Headline'}
          </button>
        </div>
        
        {(result || error || isLoading) && (
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-white mb-2">Analysis Result</h3>
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

export default HeadlineAnalyzer;