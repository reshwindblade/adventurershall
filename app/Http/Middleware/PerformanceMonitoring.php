<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class PerformanceMonitoring
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        $startMemory = memory_get_usage(true);

        $response = $next($request);

        // Only monitor in production if enabled
        if (!config('performance.monitoring.enabled', false)) {
            return $response;
        }

        $endTime = microtime(true);
        $endMemory = memory_get_usage(true);

        $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds
        $memoryUsage = $endMemory - $startMemory;
        $peakMemory = memory_get_peak_usage(true);

        // Log slow requests
        $slowThreshold = config('performance.monitoring.slow_request_threshold', 1000);
        if ($executionTime > $slowThreshold) {
            Log::warning('Slow request detected', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'execution_time_ms' => round($executionTime, 2),
                'memory_usage_mb' => round($memoryUsage / 1024 / 1024, 2),
                'peak_memory_mb' => round($peakMemory / 1024 / 1024, 2),
                'user_id' => auth()->id(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        // Add performance headers in development
        if (app()->environment('local')) {
            $response->headers->set('X-Execution-Time', round($executionTime, 2) . 'ms');
            $response->headers->set('X-Memory-Usage', round($memoryUsage / 1024 / 1024, 2) . 'MB');
            $response->headers->set('X-Peak-Memory', round($peakMemory / 1024 / 1024, 2) . 'MB');
        }

        return $response;
    }
}