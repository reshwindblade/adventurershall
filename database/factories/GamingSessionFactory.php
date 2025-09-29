<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GamingSession>
 */
class GamingSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'D&D Beginner Session',
                'Pathfinder Adventure',
                'Call of Cthulhu Mystery',
                'Vampire: The Masquerade',
                'Shadowrun Cyberpunk'
            ]),
            'system' => fake()->randomElement([
                'Dungeons & Dragons 5e',
                'Pathfinder 2e',
                'Call of Cthulhu',
                'Vampire: The Masquerade',
                'Shadowrun'
            ]),
            'description' => fake()->paragraph(),
            'duration' => fake()->randomElement([120, 180, 240]), // 2-4 hours
            'max_participants' => fake()->numberBetween(3, 8),
            'difficulty_level' => fake()->randomElement(['beginner', 'intermediate', 'advanced']),
            'is_active' => true,
        ];
    }
}