import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import { Button, Input, Select, Card } from '@/Components/UI';

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
    inquiries: {
        data: ContactInquiry[];
        links: any[];
        meta: any;
    };
    statusOptions: Record<string, string>;
    filters: {
        status?: string;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
}

export default function Index({ inquiries, statusOptions, filters }: Props) {
    const [searchForm, setSearchForm] = useState({
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        search: filters.search || '',
    });

    const handleFilter = () => {
        router.get(route('admin.contact-inquiries.index'), searchForm, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchForm({
            status: '',
            date_from: '',
            date_to: '',
            search: '',
        });
        router.get(route('admin.contact-inquiries.index'));
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

    const truncateMessage = (message: string, length: number = 100) => {
        return message.length > length ? message.substring(0, length) + '...' : message;
    };

    return (
        <AdminLayout>
            <Head title="Contact Inquiries" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
                </div>

                {/* Filters */}
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input
                            type="text"
                            placeholder="Search by name, email, or message..."
                            value={searchForm.search}
                            onChange={(e) => setSearchForm({ ...searchForm, search: e.target.value })}
                        />
                        
                        <Select
                            value={searchForm.status}
                            onChange={(e) => setSearchForm({ ...searchForm, status: e.target.value })}
                        >
                            <option value="">All Statuses</option>
                            {Object.entries(statusOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </Select>

                        <Input
                            type="date"
                            placeholder="From Date"
                            value={searchForm.date_from}
                            onChange={(e) => setSearchForm({ ...searchForm, date_from: e.target.value })}
                        />

                        <Input
                            type="date"
                            placeholder="To Date"
                            value={searchForm.date_to}
                            onChange={(e) => setSearchForm({ ...searchForm, date_to: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Button onClick={handleFilter} variant="primary">
                            Apply Filters
                        </Button>
                        <Button onClick={clearFilters} variant="secondary">
                            Clear Filters
                        </Button>
                    </div>
                </Card>

                {/* Inquiries Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Updated
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inquiries.data.map((inquiry) => (
                                    <tr key={inquiry.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {inquiry.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {inquiry.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs">
                                                {truncateMessage(inquiry.message)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(inquiry.status)}`}>
                                                {statusOptions[inquiry.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(inquiry.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(inquiry.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={route('admin.contact-inquiries.show', inquiry.id)}
                                                className="text-primary-600 hover:text-primary-900"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {inquiries.links && (
                        <div className="px-6 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {inquiries.meta.from} to {inquiries.meta.to} of {inquiries.meta.total} results
                                </div>
                                <div className="flex space-x-1">
                                    {inquiries.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 text-sm rounded-md ${
                                                link.active
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}