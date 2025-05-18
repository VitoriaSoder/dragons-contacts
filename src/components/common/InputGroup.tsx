import React from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  children: ReactNode;
  helpText?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, name, children, helpText, ...rest }) => {
  return (
    <div>
      <label htmlFor={name} className="block mb-1 text-xs font-medium text-gray-600">
        {label}
      </label>
      <div className="flex space-x-2">
        <input
          id={name}
          name={name}
          className="flex-1 p-2 text-sm border rounded focus:ring-blue-500 focus:border-blue-500"
          {...rest}
        />
        {children}
      </div>
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
};

export default InputGroup;
