import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, helpText, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        
        const baseClasses = 'block w-full rounded-md border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 sm:text-sm';
        const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
        
        const classes = [baseClasses, errorClasses, className].filter(Boolean).join(' ');

        return (
            <div>
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
                        {label}
                    </label>
                )}
                <input
                    {...props}
                    id={inputId}
                    ref={ref}
                    className={classes}
                />
                {error && (
                    <p className="mt-2 text-sm text-red-400">
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
);

Input.displayName = 'Input';

export default Input;