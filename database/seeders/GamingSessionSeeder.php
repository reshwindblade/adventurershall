<?php

namespace Database\Seeders;

use App\Models\GamingSession;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GamingSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GamingSession::create([
            'name' => 'D&D 5e Beginner Adventure',
            'system' => 'Dungeons & Dragons 5th Edition',
            'description' => 'Perfect for newcomers to D&D! Learn the basics of character creation, dice rolling, and collaborative storytelling in this guided adventure.',
            'duration' => 240, // 4 hours
            'max_participants' => 5,
            'difficulty_level' => 'beginner',
            'is_active' => true,
        ]);

        GamingSession::create([
            'name' => 'Pathfinder 2e Introduction',
            'system' => 'Pathfinder 2nd Edition',
            'description' => 'Discover the tactical depth of Pathfinder 2e with pre-generated characters and a thrilling introductory scenario.',
            'duration' => 180, // 3 hours
            'max_participants' => 4,
            'difficulty_level' => 'beginner',
            'is_active' => true,
        ]);

        GamingSession::create([
            'name' => 'Call of Cthulhu Mystery',
            'system' => 'Call of Cthulhu',
            'description' => 'Investigate cosmic horrors in this atmospheric horror RPG. Experience the unique mechanics of sanity and investigation.',
            'duration' => 300, // 5 hours
            'max_participants' => 6,
            'difficulty_level' => 'intermediate',
            'is_active' => true,
        ]);

        GamingSession::create([
            'name' => 'Cyberpunk RED Quick Start',
            'system' => 'Cyberpunk RED',
            'description' => 'Jack into the dark future with this high-tech, low-life RPG. Perfect for players wanting to try something different.',
            'duration' => 240, // 4 hours
            'max_participants' => 4,
            'difficulty_level' => 'intermediate',
            'is_active' => true,
        ]);
    }
}
