<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\Room;
use App\Models\RoomBooking;
use App\Models\User;
use App\Services\CacheService;

class TestPerformance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-performance {--iterations=10 : Number of test iterations}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test application performance optimizations';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $iterations = (int) $this->option('iterations');
        
        $this->info("🧪 Running performance tests ({$iterations} iterations)...");
        $this->newLine();

        $results = [];

        // Test database query performance
        $results['database'] = $this->testDatabasePerformance($iterations);
        
        // Test cache performance
        $results['cache'] = $this->testCachePerformance($iterations);
        
        // Test eager loading
        $results['eager_loading'] = $this->testEagerLoadingPerformance($iterations);

        // Display results
        $this->displayResults($results);

        return 0;
    }

    /**
     * Test database query performance
     */
    private function testDatabasePerformance(int $iterations): array
    {
        $this->info('📊 Testing database query performance...');
        
        $times = [];
        
        for ($i = 0; $i < $iterations; $i++) {
            $start = microtime(true);
            
            // Test complex query with joins
            RoomBooking::with(['user:id,name,email', 'room:id,name'])
                ->where('booking_date', '>=', now()->subDays(30))
                ->orderBy('booking_date', 'desc')
                ->limit(50)
                ->get();
            
            $times[] = (microtime(true) - $start) * 1000;
        }

        return [
            'avg_time' => round(array_sum($times) / count($times), 2),
            'min_time' => round(min($times), 2),
            'max_time' => round(max($times), 2),
        ];
    }

    /**
     * Test cache performance
     */
    private function testCachePerformance(int $iterations): array
    {
        $this->info('🗄️  Testing cache performance...');
        
        $cacheService = app(CacheService::class);
        
        // Test cache miss (first load)
        $start = microtime(true);
        $cacheService->getActiveRooms();
        $cacheMissTime = (microtime(true) - $start) * 1000;
        
        // Test cache hit
        $hitTimes = [];
        for ($i = 0; $i < $iterations; $i++) {
            $start = microtime(true);
            $cacheService->getActiveRooms();
            $hitTimes[] = (microtime(true) - $start) * 1000;
        }

        return [
            'cache_miss_time' => round($cacheMissTime, 2),
            'avg_hit_time' => round(array_sum($hitTimes) / count($hitTimes), 2),
            'improvement' => round($cacheMissTime / (array_sum($hitTimes) / count($hitTimes)), 1),
        ];
    }

    /**
     * Test eager loading vs N+1 queries
     */
    private function testEagerLoadingPerformance(int $iterations): array
    {
        $this->info('🔗 Testing eager loading performance...');
        
        // Test N+1 queries (bad)
        $n1Times = [];
        for ($i = 0; $i < $iterations; $i++) {
            DB::flushQueryLog();
            DB::enableQueryLog();
            
            $start = microtime(true);
            $bookings = RoomBooking::limit(10)->get();
            foreach ($bookings as $booking) {
                $booking->user->name;
                $booking->room->name;
            }
            $n1Times[] = (microtime(true) - $start) * 1000;
            
            $queryCount = count(DB::getQueryLog());
            DB::disableQueryLog();
        }

        // Test eager loading (good)
        $eagerTimes = [];
        for ($i = 0; $i < $iterations; $i++) {
            DB::flushQueryLog();
            DB::enableQueryLog();
            
            $start = microtime(true);
            $bookings = RoomBooking::with(['user:id,name', 'room:id,name'])->limit(10)->get();
            foreach ($bookings as $booking) {
                $booking->user->name;
                $booking->room->name;
            }
            $eagerTimes[] = (microtime(true) - $start) * 1000;
            
            $eagerQueryCount = count(DB::getQueryLog());
            DB::disableQueryLog();
        }

        return [
            'n1_avg_time' => round(array_sum($n1Times) / count($n1Times), 2),
            'eager_avg_time' => round(array_sum($eagerTimes) / count($eagerTimes), 2),
            'improvement' => round((array_sum($n1Times) / count($n1Times)) / (array_sum($eagerTimes) / count($eagerTimes)), 1),
            'query_reduction' => isset($queryCount) && isset($eagerQueryCount) ? $queryCount - $eagerQueryCount : 'N/A',
        ];
    }

    /**
     * Display test results
     */
    private function displayResults(array $results): void
    {
        $this->newLine();
        $this->info('📈 Performance Test Results:');
        $this->newLine();

        // Database Performance
        $this->line('<fg=cyan>Database Query Performance:</fg=cyan>');
        $this->table(
            ['Metric', 'Value'],
            [
                ['Average Time', $results['database']['avg_time'] . 'ms'],
                ['Min Time', $results['database']['min_time'] . 'ms'],
                ['Max Time', $results['database']['max_time'] . 'ms'],
            ]
        );

        // Cache Performance
        $this->line('<fg=cyan>Cache Performance:</fg=cyan>');
        $this->table(
            ['Metric', 'Value'],
            [
                ['Cache Miss Time', $results['cache']['cache_miss_time'] . 'ms'],
                ['Average Hit Time', $results['cache']['avg_hit_time'] . 'ms'],
                ['Speed Improvement', $results['cache']['improvement'] . 'x faster'],
            ]
        );

        // Eager Loading Performance
        $this->line('<fg=cyan>Eager Loading Performance:</fg=cyan>');
        $this->table(
            ['Metric', 'Value'],
            [
                ['N+1 Queries Time', $results['eager_loading']['n1_avg_time'] . 'ms'],
                ['Eager Loading Time', $results['eager_loading']['eager_avg_time'] . 'ms'],
                ['Speed Improvement', $results['eager_loading']['improvement'] . 'x faster'],
                ['Query Reduction', $results['eager_loading']['query_reduction'] . ' fewer queries'],
            ]
        );

        // Performance recommendations
        $this->newLine();
        $this->info('💡 Performance Recommendations:');
        
        if ($results['database']['avg_time'] > 50) {
            $this->warn('- Database queries are slow. Consider adding more indexes or optimizing queries.');
        } else {
            $this->line('- ✅ Database performance is good');
        }

        if ($results['cache']['improvement'] < 5) {
            $this->warn('- Cache improvement is low. Consider using Redis for better performance.');
        } else {
            $this->line('- ✅ Cache performance is excellent');
        }

        if ($results['eager_loading']['improvement'] < 2) {
            $this->warn('- Eager loading improvement is minimal. Check for proper relationship loading.');
        } else {
            $this->line('- ✅ Eager loading is working effectively');
        }
    }
}