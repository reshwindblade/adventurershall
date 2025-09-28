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
            
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <LoginForm errors={errors} status={status} />
            </div>
        </GuestLayout>
    );
}