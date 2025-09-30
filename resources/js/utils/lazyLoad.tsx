import { lazy, Suspense, ComponentType } from 'react';
import LoadingSpinner from '@/Components/UI/LoadingSpinner';

/**
 * Higher-order component for lazy loading with loading state
 */
export function lazyLoad<T extends ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ReactNode
) {
    const LazyComponent = lazy(importFunc);

    return function LazyLoadedComponent(props: React.ComponentProps<T>) {
        return (
            <Suspense fallback={fallback || <LoadingSpinner />}>
                <LazyComponent {...props} />
            </Suspense>
        );
    };
}

/**
 * Preload a component for better UX
 */
export function preloadComponent(importFunc: () => Promise<{ default: ComponentType<any> }>) {
    importFunc();
}