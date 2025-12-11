import React from 'react';

interface ToolPlaceholderProps {
  toolName: string;
}

const ToolPlaceholder: React.FC<ToolPlaceholderProps> = ({ toolName }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg h-96 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
        Tool Interface Coming Soon!
      </h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The interactive UI for the "{toolName}" will be here.
      </p>
    </div>
  );
};

export default ToolPlaceholder;