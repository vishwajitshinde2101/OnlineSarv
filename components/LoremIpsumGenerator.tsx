import React, { useState } from 'react';

const loremIpsumWords = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(' ');

const LoremIpsumGenerator: React.FC = () => {
  const [count, setCount] = useState(5);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    let result = '';
    
    const generateSentence = () => {
        const sentenceLength = Math.floor(Math.random() * 10) + 8; // 8-17 words
        let sentence = '';
        for(let i=0; i<sentenceLength; i++){
            sentence += loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)] + ' ';
        }
        return sentence.trim().charAt(0).toUpperCase() + sentence.slice(1) + '. ';
    }
    
    const generateParagraph = () => {
        const paragraphLength = Math.floor(Math.random() * 4) + 4; // 4-7 sentences
        let paragraph = '';
        for(let i=0; i<paragraphLength; i++){
            paragraph += generateSentence();
        }
        return paragraph;
    }
    
    if (type === 'words') {
      for (let i = 0; i < count; i++) {
        result += loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)] + ' ';
      }
    } else if (type === 'sentences') {
        for (let i = 0; i < count; i++) {
            result += generateSentence();
        }
    } else { // paragraphs
        for (let i = 0; i < count; i++) {
            result += generateParagraph() + '\n\n';
        }
    }

    setGeneratedText(result.trim());
    setCopied(false);
  };
  
  const handleCopy = () => {
      if(generatedText) {
          navigator.clipboard.writeText(generatedText);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-4 mb-6">
            <input type="number" value={count} onChange={e => setCount(parseInt(e.target.value))} className="w-full sm:w-24 p-2 border rounded-md dark:bg-gray-700 dark:text-white" min="1"/>
            <select value={type} onChange={e => setType(e.target.value as any)} className="w-full sm:w-48 p-2 border rounded-md dark:bg-gray-700 dark:text-white">
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
            </select>
            <button onClick={generateText} className="w-full sm:w-auto flex-grow bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg">Generate</button>
        </div>
        
        {generatedText && (
            <div>
                <textarea
                    readOnly
                    value={generatedText}
                    className="w-full h-64 p-4 border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                />
                <div className="text-center mt-4">
                    <button onClick={handleCopy} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default LoremIpsumGenerator;