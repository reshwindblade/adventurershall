import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { Button, Card } from '@/Components/UI';

interface NewsArticle {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string;
    is_published: boolean;
    published_at: string;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    article: NewsArticle;
}

export default function Show({ article }: ShowProps) {
    return (
        <AdminLayout title={article.title}>
            <Head title={`Article: ${article.title}`} />
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{article.title}</h2>
                        <p className="text-sm text-gray-500">/news/{article.slug}</p>
                    </div>
                    <div className="flex space-x-2">
                        <Link href={`/admin/news/${article.id}/edit`}>
                            <Button>Edit Article</Button>
                        </Link>
                        <Link href="/admin/news">
                            <Button variant="outline">Back to News</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {article.featured_image && (
                            <Card className="p-6 mb-6">
                                <img
                                    src={`/storage/${article.featured_image}`}
                                    alt={article.title}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </Card>
                        )}

                        {article.excerpt && (
                            <Card className="p-6 mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Excerpt</h3>
                                <p className="text-gray-700">{article.excerpt}</p>
                            </Card>
                        )}

                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Content</h3>
                            <div 
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Article Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        article.is_published 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {article.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                                    <p className="text-sm text-gray-900">/news/{article.slug}</p>
                                </div>

                                {article.published_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Published Date</label>
                                        <p className="text-sm text-gray-900">
                                            {new Date(article.published_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Created</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(article.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {article.is_published && (
                            <Card className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Public View</h3>
                                <Link 
                                    href={`/news/${article.slug}`}
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