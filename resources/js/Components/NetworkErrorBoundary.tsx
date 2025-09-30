import React, { useState, useEffect, ReactNode } from 'react';
import { Button } from './UI';

interface NetworkErrorBoundaryProps {
    children: ReactNode;
}

interface NetworkError {
    message: string;
    type: 'offline' | 'timeout' | 'server' | 'unknown';
}

export default function NetworkErrorBoundary({ children }: NetworkErrorBoundaryProps) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [networkError, setNetworkError] = useState<NetworkError | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setNetworkError(null);
            setRetryCount(0);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setNetworkError({
                message: 'You appear to be offline. Please check your internet connection.',
                type: 'offline'
            });
        };

        // Listen for network status changes
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Listen for Inertia errors
        const handleInertiaError = (event: any) => {
            const { detail } = event;
            
            if (detail?.response?.status === 0 || detail?.code === 'NETWORK_ERROR') {
                setNetworkError({
                    message: 'Unable to connect to the server. Please check your internet connection.',
                    type: 'server'
                });
            } else if (detail?.response?.status >= 500) {
                setNetworkError({
                    message: 'Server error occurred. Please try again in a moment.',
                    type: 'server'
                });
            } else if (detail?.code === 'TIMEOUT_ERROR') {
                setNetworkError({
                    message: 'Request timed out. Please try again.',
                    type: 'timeout'
                });
            }
        };

        // Listen for fetch errors (for manual API calls)
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                
                if (!response.ok && response.status >= 500) {
                    setNetworkError({
                        message: 'Server error occurred. Please try again in a moment.',
                        type: 'server'
                    });
                }
                
                return response;
            } catch (error) {
                setNetworkError({
                    message: 'Network error occurred. Please check your connection.',
                    type: 'unknown'
                });
                throw error;
            }
        };

        document.addEventListener('inertia:error', handleInertiaError);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            document.removeEventListener('inertia:error', handleInertiaError);
            window.fetch = originalFetch;
        };
    }, []);

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        setNetworkError(null);
        
        // Reload the page if multiple retries failed
        if (retryCount >= 2) {
            window.location.reload();
        }
    };

    const handleGoOffline = () => {
        setNetworkError(null);
        // Allow user to continue in offline mode if possible
    };

    if (networkError) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center px-4 z-50">
                <div className="max-w-md w-full text-center">
                    <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                            networkError.type === 'offline' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                            {networkError.type === 'offline' ? (
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L5.636 18.364m12.728-12.728L18.364 18.364M12 12l-8-8m8 8l8 8m-8-8v8m0-8H4" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        
                        <h2 className="text-xl font-display font-bold text-white mb-2">
                            {networkError.type === 'offline' ? 'You\'re Offline' : 'Connection Problem'}
                        </h2>
                        
                        <p className="text-gray-300 mb-6">
                            {networkError.message}
                        </p>
                        
                        <div className="space-y-3">
                            <Button
                                onClick={handleRetry}
                                variant="primary"
                                className="w-full"
                            >
                                {retryCount >= 2 ? 'Reload Page' : 'Try Again'}
                            </Button>
                            
                            {networkError.type === 'offline' && (
                                <Button
                                    onClick={handleGoOffline}
                                    variant="ghost"
                                    className="w-full"
                                >
                                    Continue Offline
                                </Button>
                            )}
                        </div>
                        
                        {retryCount > 0 && (
                            <p className="mt-4 text-sm text-gray-400">
                                Retry attempt: {retryCount}/3
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!isOnline) {
        return (
            <div className="bg-yellow-600 text-yellow-100 px-4 py-2 text-center text-sm">
                <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>You're currently offline. Some features may not be available.</span>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}