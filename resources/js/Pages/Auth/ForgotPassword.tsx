import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '../../Components/Layout/GuestLayout';
import ForgotPasswordForm from '../../Components/Auth/ForgotPasswordForm';
import { PageProps } from '../../types';

interface ForgotPasswordPageProps extends PageProps {
    status?: string;
}

export default function ForgotPassword({ errors, status }: ForgotPasswordPageProps) {
    return (
        <GuestLayout>
            <Head title="Forgot Password" />
            
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <ForgotPasswordForm errors={errors} status={status} />
            </div>
        </GuestLayout>
    );
}