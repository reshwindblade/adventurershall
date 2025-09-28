<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_middleware_allows_admin_users(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        // Create a test route that uses admin middleware
        $this->app['router']->get('/test-admin', function () {
            return 'Admin access granted';
        })->middleware('admin');

        $response = $this->actingAs($admin)->get('/test-admin');

        $response->assertStatus(200);
        $response->assertSeeText('Admin access granted');
    }

    public function test_admin_middleware_denies_regular_users(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        // Create a test route that uses admin middleware
        $this->app['router']->get('/test-admin', function () {
            return 'Admin access granted';
        })->middleware('admin');

        $response = $this->actingAs($user)->get('/test-admin');

        $response->assertStatus(403);
    }

    public function test_admin_middleware_redirects_guests_to_login(): void
    {
        // Create a test route that uses admin middleware
        $this->app['router']->get('/test-admin', function () {
            return 'Admin access granted';
        })->middleware('admin');

        $response = $this->get('/test-admin');

        $response->assertRedirect('/login');
    }
}