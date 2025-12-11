import React from 'react';
import { Tool } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';
import { slugify } from '../utils/slugify';
import ArrowRightIcon from './icons/ArrowRightIcon';
import { navigate } from '../utils/navigation';

interface ToolCardProps {
  tool: Tool;
  isLoading?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isLoading = false }) => {
  const Icon = tool.icon;
  
  const handleClick = () => {
    if (!isLoading) {
      navigate(`/tool/${slugify(tool.name)}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="link"
      tabIndex={isLoading ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative group bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full ${
        isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      aria-label={`View tool for ${tool.name}`}
      aria-disabled={isLoading}
    >
      
      {/* Tooltip */}
      <div role="tooltip" className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:bg-gray-700 pointer-events-none">
        {tool.description}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900 dark:border-t-gray-700" aria-hidden="true"></div>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 z-10 flex items-center justify-center rounded-lg">
          <SpinnerIcon className="w-10 h-10 text-brand-primary dark:text-brand-accent" />
        </div>
      )}

      <div className={`p-6 flex-grow flex flex-col h-full transition-all duration-300 ${isLoading ? 'blur-sm animate-pulse' : ''}`}>
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-brand-accent/20 text-brand-primary dark:text-brand-accent">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="ml-4 text-xl font-bold text-gray-800 dark:text-white">{tool.name}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow line-clamp-2">
          {tool.description}
        </p>
        
        <div className="mt-auto pt-4 text-right">
             <span className="inline-block text-brand-secondary dark:text-brand-accent transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
                 <ArrowRightIcon className="w-6 h-6" />
             </span>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;