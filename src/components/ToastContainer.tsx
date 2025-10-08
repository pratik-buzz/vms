'use client';

import React from 'react';
import Toast from './Toast';
import { ToastData } from '../contexts/ToastContext';

interface ToastContainerProps {
    toasts: ToastData[];
    onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 w-96 max-w-sm">
            <div className="space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        type={toast.type}
                        message={toast.message}
                        duration={toast.duration}
                        onClose={onRemoveToast}
                    />
                ))}
            </div>
        </div>
    );
};

export default ToastContainer;
