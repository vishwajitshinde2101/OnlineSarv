import React from 'react';

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 9.6 0 7.1-4.2 12.6-12.2 12.6C6.2 29.6 4 28.4 4 28.4c.8.2 1.6.2 2.4.2 2.3 0 4.5-.8 6.2-2.1-2.1-.1-3.9-1.5-4.5-3.5.3.1.6.1.9.1.4 0 .9 0 1.3-.2-2.2-.5-3.9-2.5-3.9-4.8v-.1c.6.3 1.3.5 2.1.6-1.3-.9-2.1-2.3-2.1-4 0-1 .3-1.8.8-2.6 2.4 2.9 5.9 4.9 9.9 5.1-.1-.3-.1-.6-.1-1 0-2.4 1.9-4.3 4.3-4.3 1.2 0 2.3.5 3.1 1.4.9-.2 1.8-.5 2.6-1 .2.6.4 1.1.8 1.6z"></path>
  </svg>
);

export default TwitterIcon;