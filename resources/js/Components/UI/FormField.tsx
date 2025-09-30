import React, { ReactNode } from 'react';

interface FormFieldProps {
    label?: string;
    error?: string;
    helpText?: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
}

export default function FormField({ 
    label, 
    error, 
    helpText, 
    required = false, 
    children, 
    className = '' 
}: FormFieldProps) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            
            {children}
            
            {error && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}
            
            {helpText && !error && (
                <p className="mt-2 text-sm text-gray-400">
                    {helpText}
                </p>
            )}
        </div>
    );
}