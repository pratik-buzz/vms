'use client'

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
    min?: string;
    max?: string;
    disabled?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    value,
    onChange,
    placeholder = "Pick a date",
    min,
    max,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [isMounted, setIsMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleResize = () => {
            if (isOpen) {
                calculateDropdownPosition();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize);
        };
    }, [isOpen]);

    const calculateDropdownPosition = () => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const dropdownHeight = 320; // Approximate height of the calendar dropdown
            const dropdownWidth = 320; // Width of the calendar dropdown
            const gap = 4;

            // Calculate position below the input
            let top = rect.bottom + gap;
            let left = rect.left;

            // Check if dropdown would go below viewport
            if (top + dropdownHeight > viewportHeight) {
                // Position above the input instead
                top = rect.top - dropdownHeight - gap;
            }

            // Check if dropdown would go beyond right edge of viewport
            if (left + dropdownWidth > viewportWidth) {
                left = viewportWidth - dropdownWidth - 10; // 10px margin from edge
            }

            // Ensure dropdown doesn't go beyond left edge
            if (left < 10) {
                left = 10;
            }

            // Ensure dropdown doesn't go above viewport
            if (top < 10) {
                top = 10;
            }

            setDropdownPosition({
                top: top + window.scrollY,
                left: left + window.scrollX
            });
        }
    };

    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const formatDisplayDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysInMonth = (date: Date): Date[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: Date[] = [];

        // Add previous month's days
        const firstDayOfWeek = firstDay.getDay();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push(new Date(year, month, -i));
        }

        // Add current month's days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        // Add next month's days to fill the grid
        const remainingDays = 42 - days.length; // 6 rows * 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push(new Date(year, month + 1, i));
        }

        return days;
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date: Date): boolean => {
        return selectedDate ? date.toDateString() === selectedDate.toDateString() : false;
    };

    const isCurrentMonth = (date: Date): boolean => {
        return date.getMonth() === currentDate.getMonth();
    };

    const isDisabled = (date: Date): boolean => {
        if (disabled) return true;

        const dateStr = formatDate(date);
        if (min && dateStr < min) return true;
        if (max && dateStr > max) return true;

        return false;
    };

    const handleDateSelect = (date: Date) => {
        if (isDisabled(date)) return;

        setSelectedDate(date);
        onChange(formatDate(date));
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
        onChange(formatDate(today));
        setIsOpen(false);
    };

    const handleClear = () => {
        setSelectedDate(null);
        onChange('');
        setIsOpen(false);
    };

    const days = getDaysInMonth(currentDate);
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const calendarDropdown = isOpen && isMounted && (
        <div
            ref={dropdownRef}
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] w-80"
            style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <h3 className="text-sm font-semibold text-gray-900">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 p-2">
                {weekDays.map((day) => (
                    <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 p-2">
                {days.map((date, index) => (
                    <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        disabled={isDisabled(date)}
                        className={`
                            w-8 h-8 text-sm rounded-md transition-all duration-200
                            ${isCurrentMonth(date) ? 'text-gray-900' : 'text-gray-400'}
                            ${isToday(date) ? 'bg-purple-100 text-purple-700 font-semibold' : ''}
                            ${isSelected(date) ? 'bg-purple text-white font-semibold' : ''}
                            ${!isCurrentMonth(date) ? 'text-gray-300' : ''}
                            ${isDisabled(date) ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100 cursor-pointer'}
                            ${isSelected(date) && isToday(date) ? 'bg-purple text-white' : ''}
                        `}
                    >
                        {date.getDate()}
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between p-3 border-t border-gray-200">
                <button
                    onClick={handleClear}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                    Clear
                </button>
                <button
                    onClick={handleToday}
                    className="text-sm text-purple hover:text-purple-700 font-medium transition-colors"
                >
                    Today
                </button>
            </div>
        </div>
    );

    return (
        <div className="relative">
            {/* Input Field */}
            <div
                ref={inputRef}
                className={`
                    w-full px-4 py-3 border border-[#D0D5DD] rounded-lg 
                    focus-within:border-gray-500 focus-within:ring-gray-200 focus-within:ring-1
                    transition-all duration-200 ease-in-out
                    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white cursor-pointer'}
                    flex items-center justify-between
                `}
                onClick={() => {
                    if (!disabled) {
                        calculateDropdownPosition();
                        setIsOpen(!isOpen);
                    }
                }}
            >
                <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
                </span>
                <Calendar className="w-4 h-4 text-gray-500" />
            </div>

            {/* Calendar Dropdown Portal */}
            {isMounted && createPortal(calendarDropdown, document.body)}
        </div>
    );
};

export default CustomDatePicker;
