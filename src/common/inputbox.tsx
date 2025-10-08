import { ChevronDown } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface InputBoxProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'select' | 'textarea' | 'date';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftIconClick?: () => void;
    onRightIconClick?: () => void;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'outlined' | 'filled' | 'underlined' | 'purple' | 'gray' | 'borderless';
    options?: { value: string; label: string }[];
    search?: boolean;
    noResultsOption?: { value: string; label: React.ReactNode; onClick?: () => void };
    rows?: number;
    min?: string;
    max?: string;
    minLength?: number;
    maxLength?: number;
}

const InputBox: React.FC<InputBoxProps> = ({
    placeholder = '',
    value = '',
    onChange,
    type = 'text',
    leftIcon,
    rightIcon,
    onLeftIconClick,
    onRightIconClick,
    disabled = false,
    error = false,
    errorMessage = '',
    className = '',
    size = 'md',
    variant = 'outlined',
    options = [],
    search = false,
    noResultsOption,
    rows = 4,
    min,
    max,
    minLength,
    maxLength
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg'
    };

    const variantClasses = {
        outlined: 'border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
        filled: 'bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
        underlined: 'border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0',
        purple: 'border border-[#E9D7FE] focus:border-purple focus:ring-purple focus:ring-1',
        gray: 'border border-[#D0D5DD] focus:border-gray-500 focus:ring-gray-200 ',
        borderless: 'border-none'
    };

    const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : '';

    const baseClasses = `
    w-full rounded-lg transition-all duration-200 ease-in-out
    focus:outline-none
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${errorClasses}
  `;

    const iconClasses = `
    flex items-center justify-center
    ${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}
    text-gray-400 hover:text-gray-600 transition-colors duration-200
    ${onLeftIconClick || onRightIconClick ? 'cursor-pointer' : ''}
  `;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newValue = e.target.value;
        console.log('InputBox onChange:', newValue); // Debug log
        onChange?.(newValue);
    };

    const handleSelectFocus = () => {
        setIsDropdownOpen(true);
    };

    const handleSelectBlur = () => {
        setIsDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Filter options based on search term
    const filteredOptions = search
        ? options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
        : options;

    return (
        <div className={`w-full `}>
            <div className={`relative flex items-center ${className}`}>
                {/* Left Icon */}
                {leftIcon && (
                    <div
                        className={`absolute left-1 z-10  ${iconClasses}`}
                        onClick={onLeftIconClick}
                    >
                        {leftIcon}
                    </div>
                )}

                {/* Input Field */}
                {type === 'select' ? (
                    <div className="relative w-full" ref={dropdownRef}>
                        <div
                            className={`
                            ${baseClasses}
                            ${leftIcon ? 'pl-10' : ''}
                            ${rightIcon ? 'pr-10' : ''}
                            cursor-pointer
                            flex items-center justify-between
                            `}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                                {value ? options.find(opt => opt.value === value)?.label || placeholder : placeholder}
                            </span>
                            <ChevronDown
                                className={`text-gray-400 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </div>

                        {/* Dropdown Options */}
                        <div className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out transform origin-top ${isDropdownOpen
                            ? 'opacity-100 scale-y-100 translate-y-0'
                            : 'opacity-0 scale-y-95 translate-y-[-10px] pointer-events-none'
                            }`}>
                            {/* Search Input - only show if search prop is true */}
                            {search && (
                                <div className="p-3 border-b border-gray-200">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        autoFocus
                                    />
                                </div>
                            )}
                            <div className="max-h-60 overflow-y-auto">
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className={`px-4 py-3 cursor-pointer transition-colors ${value === option.value
                                                ? 'bg-[#F9FAFB] text-primary font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                            onClick={() => {
                                                onChange?.(option.value);
                                                setIsDropdownOpen(false);
                                                setSearchTerm('');
                                            }}
                                        >
                                            {option.label}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-gray-500 text-center">
                                        {noResultsOption ? (
                                            <div
                                                className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium"
                                                onClick={() => {
                                                    noResultsOption.onClick?.();
                                                    setIsDropdownOpen(false);
                                                    setSearchTerm('');
                                                }}
                                            >
                                                {noResultsOption.label}
                                            </div>
                                        ) : (
                                            'No options found'
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    type === 'textarea' ? (
                        <textarea
                            value={value}
                            onChange={(e) => onChange?.(e.target.value)}
                            placeholder={placeholder}
                            disabled={disabled}
                            rows={rows}
                            minLength={minLength}
                            maxLength={maxLength}
                            className={`
                            ${baseClasses}
                            ${leftIcon ? 'pl-10' : ''}
                            ${rightIcon ? 'pr-10' : ''}
                            resize-none
                            `}
                        />
                    ) : (
                        <input
                            type={type}
                            value={value}
                            onChange={handleChange}
                            placeholder={placeholder}
                            disabled={disabled}
                            min={min}
                            max={max}
                            className={`
                        ${baseClasses}
                        ${leftIcon ? 'pl-10' : ''}
                        ${rightIcon ? 'pr-10' : ''}
                        `}
                        />
                    )
                )}

                {/* Right Icon */}
                {rightIcon && (
                    <div
                        className={`absolute right-0 z-10 ${iconClasses}`}
                        onClick={onRightIconClick}
                    >
                        {rightIcon}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && errorMessage && (
                <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
            )}
        </div>
    );
};

export default InputBox;


{/* <InputBox
    placeholder="Search"
    className=''
    size="sm"
    value={searchValue}
    onChange={(value) => {
        setSearchValue(value);
    }}
/> */}