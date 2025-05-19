import React from 'react';
import type { ReactNode } from 'react';

interface InputGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  helpText,
  children,
  className = '',
}) => {
  return (
    <div className={`${className}`}>
      <label htmlFor={name} className="block mb-1 text-xs font-medium text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="flex-1 p-2 text-sm border rounded focus:ring-blue-500 focus:border-blue-500"
        />
        {children}
      </div>
      {helpText && <div className="text-xs text-gray-500 mt-1">{helpText}</div>}
    </div>
  );
};

export default InputGroup;
