import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { Button, Card } from '@/Components/UI';

interface Page {
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_description: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    page: Page;
}

export default function Show({ page }: ShowProps) {
    return (
        <AdminLayout title={page.title}>
            <Head title={`Page: ${page.title}`} />
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{page.title}</h2>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                    </div>
                    <div className="flex space-x-2">
                        <Link href={`/admin/pages/${page.slug}/edit`}>
                            <Button>Edit Page</Button>
                        </Link>
                        <Link href="/admin/pages">
                            <Button variant="outline">Back to Pages</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Content</h3>
                            <div 
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Page Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        page.is_published 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {page.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                                    <p className="text-sm text-gray-900">/{page.slug}</p>
                                </div>

                                {page.meta_description && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                                        <p className="text-sm text-gray-900">{page.meta_description}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Created</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(page.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(page.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {page.is_published && (
                            <Card className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Public View</h3>
                                <Link 
                                    href={`/pages/${page.slug}`}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                                    target="_blank"
                                >
                                    View on website →
                                </Link>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}