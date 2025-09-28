<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Room::create([
            'name' => 'Rose Garden',
            'slug' => 'rose-garden',
            'description' => 'A beautiful and intimate gaming space perfect for small groups. The Rose Garden features comfortable seating, ambient lighting, and a cozy atmosphere that enhances your tabletop gaming experience.',
            'capacity' => 6,
            'hourly_rate' => 25.00,
            'is_active' => true,
        ]);

        Room::create([
            'name' => 'Obsidian Sanctuary',
            'slug' => 'obsidian-sanctuary',
            'description' => 'A larger, more dramatic gaming room with dark, elegant decor. The Obsidian Sanctuary is ideal for larger groups and epic campaigns, featuring premium gaming furniture and atmospheric lighting.',
            'capacity' => 10,
            'hourly_rate' => 35.00,
            'is_active' => true,
        ]);
    }
}
