import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', fullWidth = false, ...rest }, ref) => {
    const baseClasses =
      'p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';
    const errorClasses = error ? 'border-red-500' : '';
    const widthClass = fullWidth ? 'w-full' : '';
    const inputClasses = `${baseClasses} ${errorClasses} ${widthClass} ${className}`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <input ref={ref} className={inputClasses} {...rest} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
