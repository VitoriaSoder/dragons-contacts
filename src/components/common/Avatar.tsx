import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-14 h-14 text-xl',
  };

  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`${sizeClass} rounded-full bg-gray-300 flex items-center justify-center ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className={`${sizeClass} rounded-full object-cover`} />
      ) : (
        <span className={`font-semibold text-gray-600`}>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

export default Avatar;
