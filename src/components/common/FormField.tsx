import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  optional?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  helpText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  optional = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  helpText,
  ...rest
}) => {
  return (
    <div className={`${className}`}>
      <label
        htmlFor={name}
        className={`block mb-1 text-xs font-medium text-gray-600 ${labelClassName}`}
      >
        {label} {optional && '(Opcional)'}
      </label>
      <input
        id={name}
        name={name}
        className={`w-full p-2 text-sm border rounded focus:ring-blue-500 focus:border-blue-500 ${inputClassName}`}
        {...rest}
      />
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
};

export default FormField;
