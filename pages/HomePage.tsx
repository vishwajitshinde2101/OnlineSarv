import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Features from '../components/Features';
import ToolCategory from '../components/ToolCategory';
import { TOOLS } from '../constants';
import { Tool, ToolCategoryName } from '../types';
import { slugify } from '../utils/slugify';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategoryName | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate data fetching
    return () => clearTimeout(timer);
  }, []);

  const filteredTools = TOOLS.filter(tool => {
    const categoryMatch = selectedCategory === 'All' || tool.category === selectedCategory;
    
    const searchMatch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    return categoryMatch && searchMatch;
  });

  const toolsByCategory = filteredTools.reduce((acc, tool) => {
    (acc[tool.category] = acc[tool.category] || []).push(tool);
    return acc;
  }, {} as Record<ToolCategoryName, Tool[]>);

  const categoryOrder: ToolCategoryName[] = [
    ToolCategoryName.IMAGE,
    ToolCategoryName.PDF,
    ToolCategoryName.AUDIO,
    ToolCategoryName.VIDEO,
    ToolCategoryName.CALCULATOR,
    ToolCategoryName.FINANCE,
    ToolCategoryName.PRODUCTIVITY,
    ToolCategoryName.EDUCATION,
    ToolCategoryName.CONTENT,
    ToolCategoryName.SEO,
    ToolCategoryName.DEVELOPER,
    ToolCategoryName.UTILITY,
  ];

  const categoriesToDisplay = categoryOrder.filter(categoryName => {
    const toolsInCategory = toolsByCategory[categoryName];
    if (!toolsInCategory || toolsInCategory.length === 0) {
      return false;
    }
    if (selectedCategory === 'All') {
      return true;
    }
    return categoryName === selectedCategory;
  });

  const AdPlaceholder = () => (
    <div className="bg-gray-200 dark:bg-gray-800/50 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg h-96 flex items-center justify-center">
      <span className="text-gray-500 dark:text-gray-400 text-sm">Advertisement</span>
    </div>
  );

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categoryOrder}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Left Ad Sidebar */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-48">
              <AdPlaceholder />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow min-w-0">
            {filteredTools.length > 0 ? (
              categoriesToDisplay.map((categoryName) => {
                const tools = toolsByCategory[categoryName];
                return (
                  <ToolCategory
                    key={categoryName}
                    title={categoryName}
                    tools={tools}
                    id={slugify(categoryName)}
                    isLoading={isLoading}
                  />
                );
              })
            ) : (
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                  No Tools Found
                </h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                  We couldn't find any tools matching your criteria. Try a
                  different search or filter.
                </p>
              </div>
            )}
          </div>

          {/* Right Ad Sidebar */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-48">
              <AdPlaceholder />
            </div>
          </aside>
        </div>
      </main>
      <Features />
    </>
  );
};

export default HomePage;