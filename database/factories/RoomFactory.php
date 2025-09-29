<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Rose Garden', 'Obsidian Sanctuary', 'Crystal Chamber']),
            'slug' => fake()->slug(),
            'description' => fake()->paragraph(),
            'capacity' => fake()->numberBetween(4, 12),
            'hourly_rate' => fake()->randomFloat(2, 20, 50),
            'image_path' => null,
            'is_active' => true,
        ];
    }
}