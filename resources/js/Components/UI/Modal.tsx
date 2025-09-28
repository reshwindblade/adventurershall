import { Fragment, PropsWithChildren, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ModalProps extends PropsWithChildren {
    show: boolean;
    onClose: () => void;
    title?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    closeable?: boolean;
    footer?: ReactNode;
}

export default function Modal({
    children,
    show = false,
    onClose,
    title,
    maxWidth = 'md',
    closeable = true,
    footer,
}: ModalProps) {
    const maxWidthClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    };

    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={close}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={`w-full ${maxWidthClasses[maxWidth]} transform overflow-hidden rounded-lg bg-dark-800 text-left align-middle shadow-xl transition-all`}
                            >
                                {title && (
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-white"
                                        >
                                            {title}
                                        </Dialog.Title>
                                        {closeable && (
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-gray-300 focus:outline-none focus:text-gray-300"
                                                onClick={close}
                                            >
                                                <span className="sr-only">Close</span>
                                                <svg
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="px-6 py-4">
                                    {children}
                                </div>

                                {footer && (
                                    <div className="px-6 py-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
                                        {footer}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}