<?php

namespace Database\Factories;

use App\Models\GamingSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SessionBooking>
 */
class SessionBookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'gaming_session_id' => GamingSession::factory(),
            'booking_date' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'start_time' => fake()->time('H:i'),
            'participants' => fake()->numberBetween(1, 4),
            'experience_level' => fake()->randomElement(['beginner', 'intermediate', 'advanced']),
            'special_requests' => fake()->optional()->sentence(),
            'status' => fake()->randomElement(['pending', 'confirmed', 'cancelled']),
        ];
    }
}