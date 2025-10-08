'use client'

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface BaseFieldProps {
  label: string;
  required?: boolean;
  className?: string;
}

interface TextFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'tel' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

interface SearchFieldProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

interface DropdownFieldProps extends BaseFieldProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

interface CheckboxFieldProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-1 sm:space-y-2 ${className}`}>
      <label className="block text-xs sm:text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      />
    </div>
  );
};

export const SearchField: React.FC<SearchFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-1 sm:space-y-2 ${className}`}>
      <label className="block text-xs sm:text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>
    </div>
  );
};

export const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-1 sm:space-y-2 ${className}`}>
      <label className="block text-xs sm:text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4 pointer-events-none" />
      </div>
    </div>
  );
};

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked = false,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 sm:space-x-3 ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-white border-2 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 cursor-pointer"
        />
        {checked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      <label className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
};