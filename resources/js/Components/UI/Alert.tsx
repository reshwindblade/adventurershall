import React, { ReactNode } from 'react';

interface AlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    children: ReactNode;
    onClose?: () => void;
    className?: string;
}

export default function Alert({ 
    type, 
    title, 
    children, 
    onClose, 
    className = '' 
}: AlertProps) {
    const typeStyles = {
        success: {
            container: 'bg-green-900 border-green-700 text-green-100',
            icon: 'text-green-400',
            iconPath: 'M5 13l4 4L19 7',
        },
        error: {
            container: 'bg-red-900 border-red-700 text-red-100',
            icon: 'text-red-400',
            iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        },
        warning: {
            container: 'bg-yellow-900 border-yellow-700 text-yellow-100',
            icon: 'text-yellow-400',
            iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
        },
        info: {
            container: 'bg-blue-900 border-blue-700 text-blue-100',
            icon: 'text-blue-400',
            iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        },
    };

    const styles = typeStyles[type];

    return (
        <div className={`p-4 border rounded-lg ${styles.container} ${className}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={styles.iconPath} />
                    </svg>
                </div>
                
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className="text-sm font-medium mb-1">
                            {title}
                        </h3>
                    )}
                    <div className="text-sm">
                        {children}
                    </div>
                </div>
                
                {onClose && (
                    <div className="ml-auto pl-3">
                        <button
                            onClick={onClose}
                            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.icon} hover:bg-opacity-20 hover:bg-white`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}