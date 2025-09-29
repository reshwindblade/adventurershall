<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RoomBooking>
 */
class RoomBookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = fake()->time('H:i');
        $endTime = date('H:i', strtotime($startTime . ' +2 hours'));
        
        return [
            'user_id' => User::factory(),
            'room_id' => Room::factory(),
            'booking_date' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'total_cost' => fake()->randomFloat(2, 40, 100),
            'status' => fake()->randomElement(['pending', 'confirmed', 'cancelled']),
            'special_requests' => fake()->optional()->sentence(),
        ];
    }
}