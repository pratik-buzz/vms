'use client'

import React from 'react';
import { Plus } from 'lucide-react';

interface FormSectionProps {
  title: string;
  addButtonText?: string;
  onAddClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  addButtonText,
  onAddClick,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
        {addButtonText && onAddClick && (
          <button
            onClick={onAddClick}
            className="flex items-center space-x-1 sm:space-x-2 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors duration-200"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{addButtonText}</span>
          </button>
        )}
      </div>
      <div className="space-y-4 sm:space-y-6">
        {children}
      </div>
    </div>
  );
};