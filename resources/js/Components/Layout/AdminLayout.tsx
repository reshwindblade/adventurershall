import React, { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

interface PageProps {
    auth: {
        user: User;
    };
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Navigation */}
            <nav className="bg-gray-900 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="text-white font-bold text-xl">
                                    Adventurers' Hall Admin
                                </Link>
                            </div>

                            {/* Admin Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href="/admin/dashboard"
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/pages"
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out"
                                >
                                    Pages
                                </Link>
                                <Link
                                    href="/admin/news"
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out"
                                >
                                    News
                                </Link>
                                <Link
                                    href="/admin/events"
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out"
                                >
                                    Events
                                </Link>
                                <Link
                                    href={route('admin.room-bookings.index')}
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out"
                                >
                                    Room Bookings
                                </Link>
                                <Link
                                    href={route('admin.session-bookings.index')}
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out"
                                >
                                    Session Bookings
                                </Link>
                                <Link
                                    href={route('admin.contact-inquiries.index')}
                                    className="border-transparent text-gray-300 hover:text-white hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out"
                                >
                                    Contact Inquiries
                                </Link>
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="ml-3 relative">
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-300 text-sm">
                                        Welcome, {auth.user.name}
                                    </span>
                                    <Link
                                        href="/"
                                        className="text-gray-300 hover:text-white text-sm"
                                    >
                                        View Site
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-gray-300 hover:text-white text-sm"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            {title && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}