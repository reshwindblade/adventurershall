import { PropsWithChildren, ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import Navigation from './Navigation';

interface AppLayoutProps extends PropsWithChildren {
    title?: string;
    header?: ReactNode;
}

export default function AppLayout({ children, title, header }: AppLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-900">
                <Navigation />
                
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