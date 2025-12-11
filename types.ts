// Fix: Import React to provide the React namespace for types.
import type * as React from 'react';

export enum ToolCategoryName {
  IMAGE = 'Image Tools',
  PDF = 'PDF Tools',
  AUDIO = 'Audio Tools',
  VIDEO = 'Video Tools',
  CALCULATOR = 'Calculator Tools',
  FINANCE = 'Finance Tools',
  PRODUCTIVITY = 'Productivity Tools',
  EDUCATION = 'Education Tools',
  UTILITY = 'Other Useful Tools',
  DEVELOPER = 'Software Developer Tools',
  CONTENT = 'Content Creator Tools',
  SEO = 'SEO Tools',
}

export interface Tool {
  name: string;
  description: string;
  category: ToolCategoryName;
  icon: React.ComponentType<{ className?: string }>;
}