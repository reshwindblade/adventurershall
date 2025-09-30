import React from 'react';
import EnhancedLoginForm from '../Forms/EnhancedLoginForm';

interface LoginFormProps {
    errors: Record<string, string>;
    status?: string;
}

export default function LoginForm({ errors, status }: LoginFormProps) {
    return <EnhancedLoginForm status={status} />;
}