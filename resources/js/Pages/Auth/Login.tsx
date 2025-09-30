import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '../../Components/Layout/GuestLayout';
import LoginForm from '../../Components/Auth/LoginForm';
import { PageProps } from '../../types';

interface LoginPageProps extends PageProps {
    status?: string;
}

export default function Login({ errors, status }: LoginPageProps) {
    return (
        <GuestLayout>
            <Head title="Sign In" />
            
            <LoginForm errors={errors} status={status} />
        </GuestLayout>
    );
}