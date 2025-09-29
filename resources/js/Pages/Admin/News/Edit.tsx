import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { Button, Card, Input, RichTextEditor, ImageUpload, Textarea } from '@/Components/UI';

interface NewsArticle {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string;
    is_published: boolean;
    published_at: string;
}

interface NewsFormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: File | null;
    is_published: boolean;
    published_at: string;
}

interface EditProps {
    article: NewsArticle;
}

export default function Edit({ article }: EditProps) {
    const { data, setData, post, processing, errors } = useForm<NewsFormData>({
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt || '',
        featured_image: null,
        is_published: article.is_published,
        published_at: article.published_at ? article.published_at.substring(0, 16) : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/news/${article.id}`, {
            forceFormData: true,
            _method: 'put',
        });
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (title: string) => {
        setData('title', title);
        // Only auto-generate slug if it matches the current auto-generated slug
        const currentAutoSlug = generateSlug(article.title);
        if (data.slug === currentAutoSlug || data.slug === '') {
            setData('slug', generateSlug(title));
        }
    };

    const handleImageSelect = (file: File) => {
        setData('featured_image', file);
    };

    return (
        <AdminLayout title={`Edit Article: ${article.title}`}>
            <Head title={`Edit Article: ${article.title}`} />
            
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
                                    URL: /news/{data.slug || 'your-slug'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <Textarea
                                id="excerpt"
                                value={data.excerpt}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                error={errors.excerpt}
                                placeholder="Brief summary of the article"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image
                            </label>
                            <ImageUpload
                                onImageSelect={handleImageSelect}
                                currentImage={article.featured_image ? `/storage/${article.featured_image}` : undefined}
                                accept="image/*"
                            />
                            {errors.featured_image && (
                                <p className="mt-1 text-sm text-red-600">{errors.featured_image}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </label>
                            <RichTextEditor
                                value={data.content}
                                onChange={(content) => setData('content', content)}
                                placeholder="Write your article content here..."
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center">
                                <input
                                    id="is_published"
                                    type="checkbox"
                                    checked={data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                                    Published
                                </label>
                            </div>

                            {data.is_published && (
                                <div>
                                    <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-2">
                                        Publish Date
                                    </label>
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                        error={errors.published_at}
                                    />
                                </div>
                            )}
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
                                {processing ? 'Updating...' : 'Update Article'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}