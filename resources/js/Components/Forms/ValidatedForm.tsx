import React, { FormEvent, ReactNode, useState } from 'react';
import { router } from '@inertiajs/react';
import { FormValidator, ValidationRules, ValidationErrors } from '../../utils/validation';
import { Alert, LoadingSpinner } from '../UI';

interface ValidatedFormProps {
    action: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    validationRules: ValidationRules;
    initialData?: Record<string, any>;
    onSuccess?: (data: any) => void;
    onError?: (errors: ValidationErrors) => void;
    children: (props: {
        data: Record<string, any>;
        errors: ValidationErrors;
        processing: boolean;
        setData: (field: string, value: any) => void;
        setError: (field: string, error: string | null) => void;
        clearErrors: () => void;
    }) => ReactNode;
    className?: string;
    validateOnChange?: boolean;
    showGlobalErrors?: boolean;
}

export default function ValidatedForm({
    action,
    method = 'post',
    validationRules,
    initialData = {},
    onSuccess,
    onError,
    children,
    className = '',
    validateOnChange = false,
    showGlobalErrors = true,
}: ValidatedFormProps) {
    const [data, setDataState] = useState(initialData);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [processing, setProcessing] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);

    const validator = new FormValidator(validationRules);

    const setData = (field: string, value: any) => {
        setDataState(prev => ({ ...prev, [field]: value }));
        setTouched(prev => ({ ...prev, [field]: true }));

        // Clear global error when user starts typing
        if (globalError) {
            setGlobalError(null);
        }

        // Validate on change if enabled and field has been touched
        if (validateOnChange && touched[field]) {
            const rule = validationRules[field];
            if (rule) {
                const error = validator.validateField(field, value, rule);
                setErrors(prev => ({
                    ...prev,
                    [field]: error || '',
                }));
            }
        }
    };

    const setError = (field: string, error: string | null) => {
        setErrors(prev => ({
            ...prev,
            [field]: error || '',
        }));
    };

    const clearErrors = () => {
        setErrors({});
        setGlobalError(null);
    };

    const validateForm = (): boolean => {
        const validationErrors = validator.validate(data);
        setErrors(validationErrors);
        return !validator.hasErrors();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Clear previous global error
        setGlobalError(null);

        // Validate form
        if (!validateForm()) {
            return;
        }

        setProcessing(true);

        const options = {
            onSuccess: (response: any) => {
                setProcessing(false);
                clearErrors();
                onSuccess?.(response);
            },
            onError: (responseErrors: any) => {
                setProcessing(false);
                
                // Handle validation errors from server
                if (responseErrors) {
                    setErrors(responseErrors);
                    onError?.(responseErrors);
                } else {
                    setGlobalError('An unexpected error occurred. Please try again.');
                }
            },
            onFinish: () => {
                setProcessing(false);
            },
        };

        // Use appropriate Inertia method
        switch (method) {
            case 'get':
                router.get(action, data, options);
                break;
            case 'post':
                router.post(action, data, options);
                break;
            case 'put':
                router.put(action, data, options);
                break;
            case 'patch':
                router.patch(action, data, options);
                break;
            case 'delete':
                router.delete(action, options);
                break;
        }
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            {showGlobalErrors && globalError && (
                <Alert type="error" className="mb-6">
                    {globalError}
                </Alert>
            )}

            {children({
                data,
                errors,
                processing,
                setData,
                setError,
                clearErrors,
            })}
        </form>
    );
}