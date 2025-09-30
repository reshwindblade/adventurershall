import { forwardRef, InputHTMLAttributes, useState, useEffect } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
    loading?: boolean;
    success?: boolean;
    onValidate?: (value: string) => string | null;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    showValidationIcon?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ 
        className = '', 
        label, 
        error, 
        helpText, 
        loading = false,
        success = false,
        onValidate,
        validateOnBlur = true,
        validateOnChange = false,
        showValidationIcon = true,
        onBlur,
        onChange,
        id, 
        ...props 
    }, ref) => {
        const [internalError, setInternalError] = useState<string | null>(null);
        const [touched, setTouched] = useState(false);
        
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const displayError = error || internalError;
        const showSuccess = success && !displayError && touched;
        
        const baseClasses = 'block w-full rounded-md border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition-colors duration-200';
        const errorClasses = displayError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
        const successClasses = showSuccess ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : '';
        const loadingClasses = loading ? 'pr-10' : '';
        const iconClasses = (showValidationIcon && (displayError || showSuccess || loading)) ? 'pr-10' : '';
        
        const classes = [baseClasses, errorClasses, successClasses, loadingClasses, iconClasses, className].filter(Boolean).join(' ');

        const validateValue = (value: string) => {
            if (onValidate) {
                const validationError = onValidate(value);
                setInternalError(validationError);
                return validationError;
            }
            return null;
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setTouched(true);
            if (validateOnBlur) {
                validateValue(e.target.value);
            }
            onBlur?.(e);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (validateOnChange && touched) {
                validateValue(e.target.value);
            }
            onChange?.(e);
        };

        return (
            <div>
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        {...props}
                        id={inputId}
                        ref={ref}
                        className={classes}
                        onBlur={handleBlur}
                        onChange={handleChange}
                    />
                    
                    {/* Validation Icons */}
                    {showValidationIcon && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {loading && (
                                <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {!loading && displayError && (
                                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {!loading && !displayError && showSuccess && (
                                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    )}
                </div>
                
                {displayError && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {displayError}
                    </p>
                )}
                {helpText && !displayError && (
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