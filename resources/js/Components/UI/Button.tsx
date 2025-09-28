import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

export default function Button({
    className = '',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    ...props
}: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-150 ease-in-out';
    
    const variantClasses = {
        primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
        ghost: 'bg-transparent hover:bg-gray-800 focus:ring-gray-500 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500',
        outline: 'bg-white hover:bg-gray-50 focus:ring-primary-500 text-gray-700 border border-gray-300 hover:border-gray-400',
    };
    
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };
    
    const disabledClasses = 'opacity-50 cursor-not-allowed';
    
    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && disabledClasses,
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            {...props}
            className={classes}
            disabled={disabled || loading}
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {children}
        </button>
    );
}