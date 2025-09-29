import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { Button, Card, Input, RichTextEditor, ImageUpload } from '@/Components/UI';

interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    max_participants: number;
    registration_required: boolean;
    featured_image: string;
    is_published: boolean;
}

interface EventFormData {
    title: string;
    slug: string;
    description: string;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    max_participants: number | '';
    registration_required: boolean;
    featured_image: File | null;
    is_published: boolean;
}

interface EditProps {
    event: Event;
}

export default function Edit({ event }: EditProps) {
    const { data, setData, post, processing, errors } = useForm<EventFormData>({
        title: event.title,
        slug: event.slug,
        description: event.description,
        event_date: event.event_date,
        start_time: event.start_time,
        end_time: event.end_time || '',
        location: event.location || '',
        max_participants: event.max_participants || '',
        registration_required: event.registration_required,
        featured_image: null,
        is_published: event.is_published,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/events/${event.id}`, {
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
        const currentAutoSlug = generateSlug(event.title);
        if (data.slug === currentAutoSlug || data.slug === '') {
            setData('slug', generateSlug(title));
        }
    };

    const handleImageSelect = (file: File) => {
        setData('featured_image', file);
    };

    return (
        <AdminLayout title={`Edit Event: ${event.title}`}>
            <Head title={`Edit Event: ${event.title}`} />
            
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
                                    URL: /events/{data.slug || 'your-slug'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Date *
                                </label>
                                <Input
                                    id="event_date"
                                    type="date"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                    error={errors.event_date}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time *
                                </label>
                                <Input
                                    id="start_time"
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    error={errors.start_time}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time
                                </label>
                                <Input
                                    id="end_time"
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    error={errors.end_time}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <Input
                                    id="location"
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    error={errors.location}
                                    placeholder="e.g., Rose Garden Room"
                                />
                            </div>

                            <div>
                                <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Participants
                                </label>
                                <Input
                                    id="max_participants"
                                    type="number"
                                    value={data.max_participants}
                                    onChange={(e) => setData('max_participants', e.target.value ? parseInt(e.target.value) : '')}
                                    error={errors.max_participants}
                                    placeholder="Leave empty for unlimited"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image
                            </label>
                            <ImageUpload
                                onImageSelect={handleImageSelect}
                                currentImage={event.featured_image ? `/storage/${event.featured_image}` : undefined}
                                accept="image/*"
                            />
                            {errors.featured_image && (
                                <p className="mt-1 text-sm text-red-600">{errors.featured_image}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <RichTextEditor
                                value={data.description}
                                onChange={(description) => setData('description', description)}
                                placeholder="Describe your event..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center">
                                <input
                                    id="registration_required"
                                    type="checkbox"
                                    checked={data.registration_required}
                                    onChange={(e) => setData('registration_required', e.target.checked)}
                                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                />
                                <label htmlFor="registration_required" className="ml-2 block text-sm text-gray-900">
                                    Registration required
                                </label>
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
                                    Published
                                </label>
                            </div>
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
                                {processing ? 'Updating...' : 'Update Event'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}