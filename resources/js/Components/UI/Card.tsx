import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    header?: ReactNode;
    footer?: ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
    children,
    header,
    footer,
    padding = 'md',
    className = '',
    ...props
}: CardProps) {
    const baseClasses = 'bg-dark-800 shadow-lg rounded-lg border border-gray-700';
    
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };
    
    const classes = [baseClasses, className].filter(Boolean).join(' ');

    return (
        <div {...props} className={classes}>
            {header && (
                <div className="px-6 py-4 border-b border-gray-700">
                    {header}
                </div>
            )}
            
            <div className={paddingClasses[padding]}>
                {children}
            </div>
            
            {footer && (
                <div className="px-6 py-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
                    {footer}
                </div>
            )}
        </div>
    );
}