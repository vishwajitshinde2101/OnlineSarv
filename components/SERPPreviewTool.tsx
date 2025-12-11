import React, { useState } from 'react';

const SERPPreviewTool: React.FC = () => {
  const [title, setTitle] = useState('Your Page Title - Brand Name');
  const [url, setUrl] = useState('https://www.example.com/your-page-url');
  const [description, setDescription] = useState('This is an example of a meta description. It should be concise and compelling, encouraging users to click on your result in the search engine listings.');

  // Character limits (approximate)
  const titleLimit = 60;
  const descriptionLimit = 160;

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">SEO Inputs</h3>
          <div>
            <label htmlFor="title" className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>Title Tag</span>
                <span className={title.length > titleLimit ? 'text-red-500' : ''}>{title.length}/{titleLimit}</span>
            </label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label htmlFor="url" className="text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
            <input type="text" id="url" value={url} onChange={e => setUrl(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
             <label htmlFor="description" className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>Meta Description</span>
                <span className={description.length > descriptionLimit ? 'text-red-500' : ''}>{description.length}/{descriptionLimit}</span>
            </label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white resize-y" />
          </div>
        </div>

        {/* Preview */}
        <div>
           <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">Google SERP Preview</h3>
           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg font-sans">
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{url}</p>
              <h3 className="text-xl text-blue-800 dark:text-blue-400 font-medium truncate hover:underline cursor-pointer">
                {title || 'Your Page Title'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description || 'Your meta description will appear here. Make it catchy and relevant to the page content.'}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SERPPreviewTool;