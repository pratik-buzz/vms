'use client'

import React from 'react';
import { X, Menu } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
    title: string;
    onMenuClick?: () => void;
    showMenuButton?: boolean;
    showCloseButton?: boolean;
    className?: string;
    closebuttononclick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    title,
    onMenuClick,
    showMenuButton = false,
    showCloseButton = true,
    className = "",
    closebuttononclick
}) => {
    return (
        <div className={`bg-purple px-6 py-4 flex items-center justify-between flex-shrink-0 ${className}`}>
            <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                {showMenuButton && (
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-white hover:text-gray-200 transition-colors p-1"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}
                <span className="text-white font-semibold text-lg">{title}</span>
            </div>
            {showCloseButton && (
                <div className="text-white hover:text-gray-200 transition-colors cursor-pointer p-1" onClick={closebuttononclick}>
                    <X className="w-6 h-6" />
                </div>
            )}
        </div>
    );
};

export default Header;
