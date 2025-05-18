import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

interface BackButtonProps {
  to?: string;
  text?: string;
  className?: string;
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({
  to = '/dashboard',
  text = 'Voltar',
  className = '',
  onClick,
}) => {
  return (
    <div className="flex items-center">
      <Link to={to} className="mr-4">
        <Button
          type="button"
          variant="secondary"
          className={`flex items-center gap-2 px-4 py-2 text-sm ${className}`}
          onClick={onClick}
        >
          <span>{text}</span>
        </Button>
      </Link>
    </div>
  );
};

export default BackButton;
