import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
  variant?: 'default' | 'danger' | 'success' | 'warning';
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  title,
  variant = 'default',
  className = '',
}) => {
  const variantClasses = {
    default: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
    danger: 'text-gray-600 hover:text-red-600 hover:bg-red-50',
    success: 'text-gray-600 hover:text-green-600 hover:bg-green-50',
    warning: 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50',
  };

  return (
    <div
      onClick={onClick}
      title={title}
      className={`p-1.5 cursor-pointer transition-colors rounded-full ${variantClasses[variant]} ${className}`}
    >
      {icon}
    </div>
  );
};

export default IconButton;
