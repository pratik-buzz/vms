'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface ToastProps {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 5000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);



    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose(id);
        }, 300); // Match animation duration
    };
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, handleClose]);
    const getToastStyles = () => {
        const baseStyles = "relative flex items-center p-4 mb-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform";

        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-50 border border-green-200 text-green-800`;
            case 'error':
                return `${baseStyles} bg-red-50 border border-red-200 text-red-800`;
            case 'warning':
                return `${baseStyles} bg-yellow-50 border border-yellow-200 text-yellow-800`;
            case 'info':
                return `${baseStyles} bg-blue-50 border border-blue-200 text-blue-800`;
            default:
                return `${baseStyles} bg-gray-50 border border-gray-200 text-gray-800`;
        }
    };

    const getIcon = () => {
        const iconClass = "w-6 h-6 flex-shrink-0";

        switch (type) {
            case 'success':
                return <CheckCircle className={`${iconClass} text-green-600`} />;
            case 'error':
                return <XCircle className={`${iconClass} text-red-600`} />;
            case 'warning':
                return <XCircle className={`${iconClass} text-yellow-600`} />;
            case 'info':
                return <XCircle className={`${iconClass} text-blue-600`} />;
            default:
                return <CheckCircle className={`${iconClass} text-gray-600`} />;
        }
    };

    return (
        <div
            className={`
        ${getToastStyles()}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isLeaving ? 'translate-x-full opacity-0' : ''}
      `}
            style={{
                transform: isVisible && !isLeaving ? 'translateX(0)' : 'translateX(100%)',
                opacity: isVisible && !isLeaving ? 1 : 0,
            }}
        >
            <div className="flex items-center justify-between">
                {getIcon()}
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                {/* <button
                    onClick={handleClose}
                    className="ml-4 flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors duration-200"
                >
                    <X className="w-4 h-4" />
                </button> */}
            </div>
        </div>
    );
};

export default Toast;
