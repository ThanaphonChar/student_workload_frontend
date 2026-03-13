/**
 * Toast Notification System
 * แสดงข้อความแจ้งเตือนแบบ toast ที่มุมหน้าจอ
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from './Alert';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(toast => toast.id !== id));
            }, duration);
        }
    }, []);

    const success = useCallback((message, duration) => {
        showToast(message, 'success', duration);
    }, [showToast]);

    const error = useCallback((message, duration) => {
        showToast(message, 'error', duration);
    }, [showToast]);

    const warning = useCallback((message, duration) => {
        showToast(message, 'warning', duration);
    }, [showToast]);

    const info = useCallback((message, duration) => {
        showToast(message, 'info', duration);
    }, [showToast]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ success, error, warning, info, showToast }}>
            {children}
            
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className="animate-slide-in-right"
                    >
                        <Alert
                            type={toast.type}
                            message={toast.message}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
