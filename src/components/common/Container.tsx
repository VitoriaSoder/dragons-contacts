import React from 'react';

type ContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps {
  children: React.ReactNode;
  width?: ContainerWidth;
  className?: string;
  centered?: boolean;
  py?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  width = 'lg',
  className = '',
  centered = false,
  py = true,
}) => {
  const widthStyles = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={`
        w-full px-4 mx-auto
        ${widthStyles[width]}
        ${py ? 'py-8 md:py-12' : ''}
        ${centered ? 'flex flex-col items-center' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Container;
