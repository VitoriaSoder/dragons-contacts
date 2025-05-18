import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  border?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', shadow = true, border = false }) => {
  return (
    <div
      className={`
        bg-white rounded-lg p-6
        ${shadow ? 'shadow-md' : ''}
        ${border ? 'border border-offwhite2' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
