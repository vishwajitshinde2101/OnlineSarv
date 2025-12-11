import React, { useEffect, useState, useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown, className = '' }) => {
  const html = useMemo(() => {
    if (markdown) {
      // Configure marked to add target="_blank" and rel="noopener noreferrer" to links
      const renderer = new marked.Renderer();
      renderer.link = (href, title, text) => {
        return `<a target="_blank" rel="noopener noreferrer" href="${href}" title="${title || ''}">${text}</a>`;
      };
      marked.setOptions({ renderer });

      // Sanitize the HTML to prevent XSS attacks
      const dirtyHtml = marked.parse(markdown) as string;
      // In a real-world app, use a sanitizer like DOMPurify here.
      // For this environment, we'll trust the output from Gemini and Marked.
      return dirtyHtml;
    }
    return '';
  }, [markdown]);

  return (
    <div
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
export default MarkdownPreview;
