import React, { useState } from 'react';
import MarkdownPreview from './MarkdownPreview';

const defaultMarkdown = `# Welcome to the Markdown Editor!

This is a live Markdown editor. Type your Markdown text in the left panel, and see the rendered HTML in the right panel.

## Features
- **Live Preview:** Updates as you type.
- **Easy to Use:** Simple split-screen interface.
- **Standard Markdown:** Supports common Markdown syntax.

### Example List
1. First item
2. Second item
   - Nested item
3. Third item

> This is a blockquote. Use it to highlight important text.

Enjoy writing!
`;

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[75vh]">
            {/* Editor */}
            <div>
                <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-800 dark:text-white font-mono"
                    placeholder="Type your Markdown here..."
                />
            </div>
            {/* Preview */}
            <div className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 overflow-auto">
                <MarkdownPreview markdown={markdown} />
            </div>
        </div>
    </div>
  );
};

export default MarkdownEditor;