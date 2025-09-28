<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test users
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@adventurershall.com',
            'is_admin' => true,
        ]);

        // Seed initial data
        $this->call([
            RoomSeeder::class,
            PageSeeder::class,
            GamingSessionSeeder::class,
            NewsArticleSeeder::class,
            EventSeeder::class,
        ]);
    }
}
