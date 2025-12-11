import React from 'react';

const FlipHorizontalIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <path d="M12 22V2"></path>
        <path d="M17 12H3l4-4"></path>
        <path d="M3 12l4 4"></path>
        <path d="M21 12h-4"></path>
    </svg>
);

export default FlipHorizontalIcon;