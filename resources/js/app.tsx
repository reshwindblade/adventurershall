import './bootstrap';
import '../css/app.css';
import './utils/route';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ErrorBoundary from './Components/ErrorBoundary';
import NetworkErrorBoundary from './Components/NetworkErrorBoundary';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx', { eager: false })),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ErrorBoundary>
                <NetworkErrorBoundary>
                    <App {...props} />
                </NetworkErrorBoundary>
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#ec4899',
        delay: 250,
        includeCSS: true,
        showSpinner: true,
    },
});