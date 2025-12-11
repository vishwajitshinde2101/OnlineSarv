import React from 'react';

const FlipVerticalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M22 12H2"></path>
        <path d="M12 17V3l-4 4"></path>
        <path d="M12 3l4 4"></path>
        <path d="M12 21v-4"></path>
    </svg>
);

export default FlipVerticalIcon;