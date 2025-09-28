import { useState } from 'react';
import { PageProps } from '@/types';
import { AppLayout, Button, Input, Textarea, Select, Card, Modal } from '@/Components';

export default function ComponentTest({}: PageProps) {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        category: '',
    });

    const selectOptions = [
        { value: 'general', label: 'General Inquiry' },
        { value: 'booking', label: 'Booking Question' },
        { value: 'event', label: 'Event Information' },
        { value: 'feedback', label: 'Feedback' },
    ];

    return (
        <AppLayout title="Component Test">
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <Card header={<h2 className="text-xl font-semibold text-white">Component Test Page</h2>}>
                        <p className="text-gray-300 mb-6">
                            This page demonstrates all the UI components and layouts that have been implemented.
                        </p>
                        
                        <div className="space-y-6">
                            {/* Buttons */}
                            <div>
                                <h3 className="text-lg font-medium text-white mb-4">Buttons</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="primary">Primary Button</Button>
                                    <Button variant="secondary">Secondary Button</Button>
                                    <Button variant="danger">Danger Button</Button>
                                    <Button variant="ghost">Ghost Button</Button>
                                    <Button loading>Loading Button</Button>
                                    <Button disabled>Disabled Button</Button>
                                </div>
                            </div>

                            {/* Form Components */}
                            <div>
                                <h3 className="text-lg font-medium text-white mb-4">Form Components</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        helpText="This is a help text"
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        error={formData.email && !formData.email.includes('@') ? 'Please enter a valid email' : ''}
                                    />
                                    <div className="md:col-span-2">
                                        <Select
                                            label="Category"
                                            options={selectOptions}
                                            placeholder="Select a category"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Textarea
                                            label="Message"
                                            placeholder="Enter your message"
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Test */}
                            <div>
                                <h3 className="text-lg font-medium text-white mb-4">Modal</h3>
                                <Button onClick={() => setShowModal(true)}>
                                    Open Modal
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Additional Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card padding="sm">
                            <h4 className="font-semibold text-white mb-2">Small Padding</h4>
                            <p className="text-gray-300 text-sm">This card has small padding.</p>
                        </Card>
                        <Card padding="md">
                            <h4 className="font-semibold text-white mb-2">Medium Padding</h4>
                            <p className="text-gray-300 text-sm">This card has medium padding.</p>
                        </Card>
                        <Card padding="lg">
                            <h4 className="font-semibold text-white mb-2">Large Padding</h4>
                            <p className="text-gray-300 text-sm">This card has large padding.</p>
                        </Card>
                    </div>

                    <Card
                        header={<h3 className="text-lg font-semibold text-white">Card with Header and Footer</h3>}
                        footer={
                            <div className="flex justify-end space-x-3">
                                <Button variant="ghost" size="sm">Cancel</Button>
                                <Button size="sm">Save</Button>
                            </div>
                        }
                    >
                        <p className="text-gray-300">
                            This card demonstrates the header and footer functionality. 
                            The header and footer have different background colors to distinguish them from the main content.
                        </p>
                    </Card>
                </div>
            </div>

            {/* Modal */}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Test Modal"
                maxWidth="lg"
                footer={
                    <div className="flex justify-end space-x-3">
                        <Button variant="ghost" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setShowModal(false)}>
                            Confirm
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-gray-300">
                        This is a test modal to demonstrate the modal component functionality.
                        It includes a title, content area, and footer with action buttons.
                    </p>
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-300">
                            The modal supports different sizes, custom headers and footers, 
                            and can be made non-closeable if needed.
                        </p>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}