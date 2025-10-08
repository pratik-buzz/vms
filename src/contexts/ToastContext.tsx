'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ToastContainer from '../components/ToastContainer';
import { ToastProps } from '../components/Toast';

export interface ToastData {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
    showSuccess: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
    showWarning: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((
        message: string,
        type: 'success' | 'error' | 'warning' | 'info' = 'info',
        duration: number = 5000
    ) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: ToastData = {
            id,
            type,
            message,
            duration,
        };

        setToasts((prevToasts) => [...prevToasts, newToast]);
    }, []);

    const showSuccess = useCallback((message: string, duration?: number) => {
        showToast(message, 'success', duration);
    }, [showToast]);

    const showError = useCallback((message: string, duration?: number) => {
        showToast(message, 'error', duration);
    }, [showToast]);

    const showWarning = useCallback((message: string, duration?: number) => {
        showToast(message, 'warning', duration);
    }, [showToast]);

    const showInfo = useCallback((message: string, duration?: number) => {
        showToast(message, 'info', duration);
    }, [showToast]);

    const contextValue: ToastContextType = {
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
        </ToastContext.Provider>
    );
};
