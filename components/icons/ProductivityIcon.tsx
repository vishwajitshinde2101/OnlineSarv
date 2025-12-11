import React from 'react';

const ProductivityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w.org/2000/svg"
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
    <path d="M8 6h10"></path>
    <path d="M6 12h12"></path>
    <path d="M4 18h14"></path>
    <path d="m3 6 3 3-3 3"></path>
    <path d="m3 12 3 3-3 3"></path>
  </svg>
);

export default ProductivityIcon;