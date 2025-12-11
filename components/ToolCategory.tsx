import React from 'react';
import { Tool } from '../types';
import ToolCard from './ToolCard';

interface ToolCategoryProps {
  title: string;
  tools: Tool[];
  id: string;
  isLoading?: boolean;
}

const ToolCategory: React.FC<ToolCategoryProps> = ({ title, tools, id, isLoading }) => {
  return (
    <section id={id} className="mb-12 scroll-mt-48">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-l-4 border-brand-accent pl-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.name} tool={tool} isLoading={isLoading} />
        ))}
      </div>
    </section>
  );
};

export default ToolCategory;
