<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Performance Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains performance-related configuration options for the
    | Adventurers' Hall application.
    |
    */

    'cache' => [
        'default_ttl' => env('CACHE_DEFAULT_TTL', 3600), // 1 hour
        'long_ttl' => env('CACHE_LONG_TTL', 86400), // 24 hours
        'short_ttl' => env('CACHE_SHORT_TTL', 300), // 5 minutes
    ],

    'database' => [
        'slow_query_threshold' => env('DB_SLOW_QUERY_THRESHOLD', 100), // milliseconds
        'enable_query_log' => env('DB_ENABLE_QUERY_LOG', false),
    ],

    'images' => [
        'optimization' => [
            'enabled' => env('IMAGE_OPTIMIZATION_ENABLED', true),
            'quality' => env('IMAGE_QUALITY', 85),
            'webp_enabled' => env('WEBP_ENABLED', true),
            'sizes' => [
                'thumbnail' => ['width' => 300, 'height' => 200],
                'medium' => ['width' => 600, 'height' => 400],
                'large' => ['width' => 1200, 'height' => 800],
            ],
        ],
        'cdn' => [
            'enabled' => env('CDN_ENABLED', false),
            'url' => env('CDN_URL', ''),
        ],
    ],

    'frontend' => [
        'lazy_loading' => env('LAZY_LOADING_ENABLED', true),
        'code_splitting' => env('CODE_SPLITTING_ENABLED', true),
        'preload_critical' => env('PRELOAD_CRITICAL_ENABLED', true),
    ],

    'monitoring' => [
        'enabled' => env('PERFORMANCE_MONITORING_ENABLED', false),
        'slow_request_threshold' => env('SLOW_REQUEST_THRESHOLD', 1000), // milliseconds
    ],
];