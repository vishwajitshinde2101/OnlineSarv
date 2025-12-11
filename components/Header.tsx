import React from 'react';
import SearchIcon from './icons/SearchIcon';
import { ToolCategoryName } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ToolCategoryName | 'All';
  onCategoryChange: (category: ToolCategoryName | 'All') => void;
  categories: ToolCategoryName[];
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}) => {
  return (
    <header className="bg-neutral-light dark:bg-neutral-dark shadow-md sticky top-16 z-10 border-b dark:border-gray-700/50">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            All Your Online Tools in One Place
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Convert, edit, compress and optimize files without installing any software. 100% free and secure.
          </p>
          <div className="mt-8 w-full max-w-xl mx-auto">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                <SearchIcon className="w-5 h-5" />
              </span>
              <input
                type="search"
                placeholder="Search for a tool..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-shadow"
                aria-label="Search for a tool"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => onCategoryChange('All')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
                selectedCategory === 'All'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;