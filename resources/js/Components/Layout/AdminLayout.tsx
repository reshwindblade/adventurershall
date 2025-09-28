import { PropsWithChildren, ReactNode } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Navigation from './Navigation';

interface AdminLayoutProps extends PropsWithChildren {
    title?: string;
    header?: ReactNode;
}

export default function AdminLayout({ children, title, header }: AdminLayoutProps) {
    const { auth } = usePage<PageProps>().props;

    // Redirect non-admin users (this should be handled server-side too)
    if (!auth.user?.is_admin) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
                    <p className="text-gray-300 mb-4">You don't have permission to access this area.</p>
                    <Link href="/" className="text-primary-400 hover:text-primary-300">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title={title ? `Admin - ${title}` : 'Admin Panel'} />
            <div className="min-h-screen bg-gray-900">
                <Navigation />
                
                {/* Admin Navigation */}
                <nav className="bg-dark-800 border-b border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex space-x-8">
                                    <Link
                                        href="/admin"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white border-b-2 border-transparent hover:border-primary-500"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/admin/pages"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white border-b-2 border-transparent hover:border-primary-500"
                                    >
                                        Pages
                                    </Link>
                                    <Link
                                        href="/admin/news"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white border-b-2 border-transparent hover:border-primary-500"
                                    >
                                        News
                                    </Link>
                                    <Link
                                        href="/admin/events"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white border-b-2 border-transparent hover:border-primary-500"
                                    >
                                        Events
                                    </Link>
                                    <Link
                                        href="/admin/bookings"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white border-b-2 border-transparent hover:border-primary-500"
                                    >
                                        Bookings
                                    </Link>
                                    <Link
                                        href="/admin/inquiries"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white border-b-2 border-transparent hover:border-primary-500"
                                    >
                                        Inquiries
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="bg-dark-800 shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}