import React, { useState, useMemo } from 'react';

interface DensityResult {
  keyword: string;
  count: number;
  density: string;
}

const KeywordDensityChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [keywords, setKeywords] = useState('');

  const results: DensityResult[] = useMemo(() => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;
    if (totalWords === 0 || !keywords) return [];

    const keywordList = keywords.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);

    return keywordList.map(keyword => {
      const count = words.filter(word => word === keyword).length;
      const density = totalWords > 0 ? ((count / totalWords) * 100).toFixed(2) : '0.00';
      return { keyword, count, density: `${density}%` };
    });
  }, [text, keywords]);
  
  const totalWords = useMemo(() => (text.match(/\b\w+\b/g) || []).length, [text]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Text ({totalWords} words)</label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your article here..."
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-white min-h-[300px]"
              />
            </div>
            <div>
              <label htmlFor="keywords-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keywords (comma-separated)</label>
              <input
                type="text"
                id="keywords-input"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., seo, marketing, content"
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-6 lg:mt-0">
             <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-white mb-2">Analysis Results</h3>
             <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md min-h-[300px]">
                {results.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Keyword</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Count</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Density</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {results.map(r => (
                                <tr key={r.keyword}>
                                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{r.keyword}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{r.count}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{r.density}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-400 p-10">Results will appear here.</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordDensityChecker;