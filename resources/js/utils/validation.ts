// Client-side validation utilities

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email?: boolean;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
}

export interface ValidationRules {
    [key: string]: ValidationRule;
}

export interface ValidationErrors {
    [key: string]: string;
}

export class FormValidator {
    private rules: ValidationRules;
    private errors: ValidationErrors = {};

    constructor(rules: ValidationRules) {
        this.rules = rules;
    }

    validate(data: Record<string, any>): ValidationErrors {
        this.errors = {};

        Object.keys(this.rules).forEach(field => {
            const rule = this.rules[field];
            const value = data[field];
            const error = this.validateField(field, value, rule);
            
            if (error) {
                this.errors[field] = error;
            }
        });

        return this.errors;
    }

    validateField(field: string, value: any, rule: ValidationRule): string | null {
        // Required validation
        if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
            return `${this.getFieldLabel(field)} is required.`;
        }

        // Skip other validations if field is empty and not required
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            return null;
        }

        // Email validation
        if (rule.email && !this.isValidEmail(value)) {
            return 'Please enter a valid email address.';
        }

        // String length validations
        if (typeof value === 'string') {
            if (rule.minLength && value.length < rule.minLength) {
                return `${this.getFieldLabel(field)} must be at least ${rule.minLength} characters.`;
            }

            if (rule.maxLength && value.length > rule.maxLength) {
                return `${this.getFieldLabel(field)} cannot exceed ${rule.maxLength} characters.`;
            }
        }

        // Numeric validations
        if (typeof value === 'number') {
            if (rule.min !== undefined && value < rule.min) {
                return `${this.getFieldLabel(field)} must be at least ${rule.min}.`;
            }

            if (rule.max !== undefined && value > rule.max) {
                return `${this.getFieldLabel(field)} cannot exceed ${rule.max}.`;
            }
        }

        // Pattern validation
        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
            return `${this.getFieldLabel(field)} format is invalid.`;
        }

        // Custom validation
        if (rule.custom) {
            const customError = rule.custom(value);
            if (customError) {
                return customError;
            }
        }

        return null;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private getFieldLabel(field: string): string {
        // Convert field names to readable labels
        return field
            .replace(/_/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    hasErrors(): boolean {
        return Object.keys(this.errors).length > 0;
    }

    getErrors(): ValidationErrors {
        return this.errors;
    }

    getError(field: string): string | null {
        return this.errors[field] || null;
    }
}

// Predefined validation rules for common use cases
export const commonValidationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 255,
        pattern: /^[a-zA-Z\s'-]+$/,
    },
    email: {
        required: true,
        email: true,
        maxLength: 255,
    },
    password: {
        required: true,
        minLength: 8,
        maxLength: 255,
        custom: (value: string) => {
            if (!/(?=.*[a-z])/.test(value)) {
                return 'Password must contain at least one lowercase letter.';
            }
            if (!/(?=.*[A-Z])/.test(value)) {
                return 'Password must contain at least one uppercase letter.';
            }
            if (!/(?=.*\d)/.test(value)) {
                return 'Password must contain at least one number.';
            }
            return null;
        },
    },
    username: {
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9_-]+$/,
    },
    phone: {
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 2000,
    },
    bookingDate: {
        required: true,
        custom: (value: string) => {
            const date = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date < today) {
                return 'Booking date must be today or in the future.';
            }
            return null;
        },
    },
    time: {
        required: true,
        pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
};

// Real-time validation hook for React components
export function useFormValidation(rules: ValidationRules, initialData: Record<string, any> = {}) {
    const [data, setData] = React.useState(initialData);
    const [errors, setErrors] = React.useState<ValidationErrors>({});
    const [touched, setTouched] = React.useState<Record<string, boolean>>({});
    
    const validator = new FormValidator(rules);

    const validateField = (field: string, value: any) => {
        const rule = rules[field];
        if (!rule) return;

        const error = validator.validateField(field, value, rule);
        setErrors(prev => ({
            ...prev,
            [field]: error || '',
        }));
    };

    const validateAll = () => {
        const allErrors = validator.validate(data);
        setErrors(allErrors);
        return !validator.hasErrors();
    };

    const setValue = (field: string, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
        
        // Validate field if it has been touched
        if (touched[field]) {
            validateField(field, value);
        }
    };

    const setFieldTouched = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, data[field]);
    };

    const reset = () => {
        setData(initialData);
        setErrors({});
        setTouched({});
    };

    return {
        data,
        errors,
        touched,
        setValue,
        setTouched: setFieldTouched,
        validateAll,
        reset,
        hasErrors: Object.values(errors).some(error => error !== ''),
    };
}

// Import React for the hook
import React from 'react';