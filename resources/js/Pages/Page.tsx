import { Head } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { Page } from '@/types';

interface Props {
    page: Page;
}

export default function PageShow({ page }: Props) {
    return (
        <AppLayout>
            <Head title={`${page.title} - Adventurers' Hall`} />
            
            <div className="min-h-screen bg-white">
                {/* Page Header */}
                <section className="relative bg-gradient-to-r from-black via-gray-900 to-black py-20">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            {page.title}
                        </h1>
                        {page.meta_description && (
                            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                                {page.meta_description}
                            </p>
                        )}
                    </div>
                </section>

                {/* Page Content */}
                <section className="py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div 
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}