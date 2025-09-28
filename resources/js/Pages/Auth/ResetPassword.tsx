import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '../../Components/Layout/GuestLayout';
import ResetPasswordForm from '../../Components/Auth/ResetPasswordForm';
import { PageProps } from '../../types';

interface ResetPasswordPageProps extends PageProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email, errors }: ResetPasswordPageProps) {
    return (
        <GuestLayout>
            <Head title="Reset Password" />
            
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <ResetPasswordForm token={token} email={email} errors={errors} />
            </div>
        </GuestLayout>
    );
}