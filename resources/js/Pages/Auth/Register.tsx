import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '../../Components/Layout/GuestLayout';
import RegisterForm from '../../Components/Auth/RegisterForm';
import { PageProps } from '../../types';

export default function Register({ errors }: PageProps) {
    return (
        <GuestLayout>
            <Head title="Create Account" />
            
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <RegisterForm errors={errors} />
            </div>
        </GuestLayout>
    );
}