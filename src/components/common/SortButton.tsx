import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface SortButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'asc' | 'desc';
  className?: string;
}

const SortButton: React.FC<SortButtonProps> = ({ direction, className = '', ...rest }) => {
  const baseClasses =
    'flex items-center justify-center p-3 border border-primary rounded-lg bg-white hover:bg-blue-50 min-w-[60px]';

  return (
    <button className={`${baseClasses} ${className}`} {...rest}>
      <span className="text-sm text-primary">{direction === 'asc' ? 'A-Z' : 'Z-A'}</span>
    </button>
  );
};

export default SortButton;
