import React from 'react';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ showText = true, size = 'md' }) => {
  const sizes = {
    sm: { logo: 'w-8 h-8', text: 'text-lg' },
    md: { logo: 'w-12 h-12', text: 'text-xl' },
    lg: { logo: 'w-16 h-16', text: 'text-2xl' },
  };

  return (
    <div className="flex items-center gap-3">
      <img src="/images/dragon-logo.svg" alt="Dragon Contacts Logo" className={sizes[size].logo} />
      {showText && (
        <h1 className={`font-bold text-primary ${sizes[size].text}`}>Dragon Contacts</h1>
      )}
    </div>
  );
};

export default Logo;
