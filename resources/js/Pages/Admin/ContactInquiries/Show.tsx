import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { Button, Select, Textarea, Card } from '@/Components/UI';

interface ContactInquiry {
    id: number;
    name: string;
    email: string;
    message: string;
    status: string;
    admin_notes?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    inquiry: ContactInquiry;
}

export default function Show({ inquiry }: Props) {
    const [form, setForm] = useState({
        status: inquiry.status,
        admin_notes: inquiry.admin_notes || '',
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const statusOptions = {
        pending: 'Pending',
        new: 'New',
        in_progress: 'In Progress',
        resolved: 'Resolved',
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        router.put(route('admin.contact-inquiries.update', inquiry.id), form, {
            onFinish: () => setIsUpdating(false),
        });
    };

    const getStatusBadgeClass = (status: string) => {
        const classes = {
            pending: 'bg-yellow-100 text-yellow-800',
            new: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-purple-100 text-purple-800',
            resolved: 'bg-green-100 text-green-800',
        };
        return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout>
            <Head title={`Contact Inquiry #${inquiry.id}`} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Contact Inquiry #{inquiry.id}
                        </h1>
                        <p className="text-gray-600">
                            Submitted on {new Date(inquiry.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <Link
                        href={route('admin.contact-inquiries.index')}
                        className="text-primary-600 hover:text-primary-900"
                    >
                        ← Back to Inquiries
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Inquiry Details */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inquiry Details</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(inquiry.status)}`}>
                                    {statusOptions[inquiry.status as keyof typeof statusOptions]}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <p className="text-sm text-gray-900">{inquiry.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="text-sm text-gray-900">
                                    <a 
                                        href={`mailto:${inquiry.email}`}
                                        className="text-primary-600 hover:text-primary-900"
                                    >
                                        {inquiry.email}
                                    </a>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Message</label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                                    {inquiry.message}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Inquiry Submitted</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(inquiry.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {inquiry.updated_at !== inquiry.created_at && (
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Last Updated</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(inquiry.updated_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {inquiry.admin_notes && (
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Admin Notes
                                </label>
                                <div className="text-sm text-gray-900 bg-blue-50 p-3 rounded-md">
                                    {inquiry.admin_notes}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Admin Management */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Management</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Update Status
                                </label>
                                <Select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    required
                                >
                                    {Object.entries(statusOptions).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Notes
                            </label>
                            <Textarea
                                value={form.admin_notes}
                                onChange={(e) => setForm({ ...form, admin_notes: e.target.value })}
                                rows={6}
                                placeholder="Add internal notes about this inquiry, follow-up actions, or resolution details..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                These notes are for internal use only and will not be visible to the customer.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Updating...' : 'Update Inquiry'}
                            </Button>
                            
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => window.open(`mailto:${inquiry.email}?subject=Re: Your inquiry to Adventurers' Hall`)}
                            >
                                Reply via Email
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}