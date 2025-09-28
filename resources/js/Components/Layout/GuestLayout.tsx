import { PropsWithChildren } from 'react';
import { Head, Link } from '@inertiajs/react';

interface GuestLayoutProps extends PropsWithChildren {
    title?: string;
}

export default function GuestLayout({ children, title }: GuestLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-900 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
                <div className="mb-6">
                    <Link href="/">
                        <h1 className="text-4xl font-display font-bold text-white">
                            Adventurers' Hall
                        </h1>
                        <p className="text-center text-primary-300 mt-2">
                            Board Game & Tabletop Cafe
                        </p>
                    </Link>
                </div>

                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-dark-800 shadow-md overflow-hidden sm:rounded-lg">
                    {children}
                </div>
            </div>
        </>
    );
}