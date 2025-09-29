import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { Button, Card, Input, RichTextEditor } from '@/Components/UI';

interface PageFormData {
    title: string;
    slug: string;
    content: string;
    meta_description: string;
    is_published: boolean;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<PageFormData>({
        title: '',
        slug: '',
        content: '',
        meta_description: '',
        is_published: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/pages');
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (title: string) => {
        setData('title', title);
        if (!data.slug) {
            setData('slug', generateSlug(title));
        }
    };

    return (
        <AdminLayout title="Create Page">
            <Head title="Create Page" />
            
            <div className="max-w-4xl mx-auto">
                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    error={errors.title}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                                    Slug *
                                </label>
                                <Input
                                    id="slug"
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    error={errors.slug}
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    URL: /pages/{data.slug || 'your-slug'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description
                            </label>
                            <Input
                                id="meta_description"
                                type="text"
                                value={data.meta_description}
                                onChange={(e) => setData('meta_description', e.target.value)}
                                error={errors.meta_description}
                                placeholder="Brief description for search engines"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </label>
                            <RichTextEditor
                                value={data.content}
                                onChange={(content) => setData('content', content)}
                                placeholder="Write your page content here..."
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="is_published"
                                type="checkbox"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                                Publish immediately
                            </label>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Creating...' : 'Create Page'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}