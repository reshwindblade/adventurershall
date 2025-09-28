// Simple route helper for Laravel routes
export function route(name: string, params?: string | number | Record<string, any>): string {
    const routes: Record<string, string> = {
        'home': '/',
        'about': '/about',
        'contact': '/contact',
        'contact.store': '/contact',
        'news.index': '/news',
        'news.show': '/news/{article}',
        'events.index': '/events',
        'events.show': '/events/{event}',
        'pages.show': '/pages/{page}',
        'login': '/login',
        'register': '/register',
        'password.request': '/forgot-password',
        'password.reset': '/reset-password/{token}',
        'auth.google': '/auth/google',
        'auth.facebook': '/auth/facebook',
    };

    let url = routes[name];
    if (!url) {
        console.warn(`Route "${name}" not found`);
        return '/';
    }

    // Replace route parameters
    if (params) {
        if (typeof params === 'string' || typeof params === 'number') {
            // Single parameter - replace the first placeholder
            url = url.replace(/\{[^}]+\}/, String(params));
        } else if (typeof params === 'object') {
            // Multiple parameters - replace by key
            Object.entries(params).forEach(([key, value]) => {
                url = url.replace(`{${key}}`, String(value));
            });
        }
    }

    return url;
}

// Make it available globally
declare global {
    function route(name: string, params?: string | number | Record<string, any>): string;
}

(window as any).route = route;