import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helpText?: string;
    options: SelectOption[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', label, error, helpText, options, placeholder, id, ...props }, ref) => {
        const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
        
        const baseClasses = 'block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm';
        const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
        
        const classes = [baseClasses, errorClasses, className].filter(Boolean).join(' ');

        return (
            <div>
                {label && (
                    <label htmlFor={selectId} className="block text-sm font-medium text-gray-300 mb-2">
                        {label}
                    </label>
                )}
                <select
                    {...props}
                    id={selectId}
                    ref={ref}
                    className={classes}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
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

Select.displayName = 'Select';

export default Select;