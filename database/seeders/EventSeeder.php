<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Upcoming Events
        Event::create([
            'title' => 'D&D 5e Beginner\'s Workshop',
            'slug' => 'dnd-5e-beginners-workshop',
            'description' => '<p>New to Dungeons & Dragons? This workshop is perfect for you!</p>

<p>Join us for a comprehensive introduction to the world\'s most popular tabletop RPG. Our experienced Dungeon Master will guide you through character creation, basic rules, and your first adventure.</p>

<h2>What You\'ll Learn:</h2>
<ul>
<li>How to create your first D&D character</li>
<li>Basic game mechanics and dice rolling</li>
<li>Roleplaying fundamentals</li>
<li>Combat basics</li>
<li>How to work as a team</li>
</ul>

<p>All materials provided! Just bring your enthusiasm for adventure.</p>',
            'event_date' => now()->addDays(10),
            'start_time' => '14:00',
            'end_time' => '17:00',
            'location' => 'Rose Garden Room',
            'max_participants' => 6,
            'registration_required' => true,
            'is_published' => true,
        ]);

        Event::create([
            'title' => 'Magic: The Gathering Draft Night',
            'slug' => 'mtg-draft-night',
            'description' => '<p>Join us for our weekly Magic: The Gathering draft tournament!</p>

<p>Every Friday night, we host a friendly draft tournament using the latest set. Whether you\'re a seasoned planeswalker or new to the multiverse, everyone is welcome.</p>

<h2>Format Details:</h2>
<ul>
<li>Swiss rounds based on attendance</li>
<li>Prize support for all participants</li>
<li>Casual and competitive players welcome</li>
<li>Latest set boosters provided</li>
</ul>

<p>Entry fee includes three booster packs and prize support. Bring your own basic lands or borrow ours!</p>',
            'event_date' => now()->addDays(5),
            'start_time' => '19:00',
            'end_time' => '22:00',
            'location' => 'Obsidian Sanctuary Room',
            'max_participants' => 8,
            'registration_required' => true,
            'is_published' => true,
        ]);

        Event::create([
            'title' => 'Board Game Social Night',
            'slug' => 'board-game-social-night',
            'description' => '<p>Come meet fellow gamers and try out new board games in a relaxed, social environment!</p>

<p>Every second Saturday of the month, we open our doors for a casual board game night. Bring your friends or come solo and make new ones!</p>

<h2>What to Expect:</h2>
<ul>
<li>Large selection of modern board games</li>
<li>Friendly atmosphere for all skill levels</li>
<li>Game recommendations from our staff</li>
<li>Light snacks and beverages available</li>
</ul>

<p>No registration required - just drop in and start playing!</p>',
            'event_date' => now()->addDays(15),
            'start_time' => '18:00',
            'end_time' => '23:00',
            'location' => 'Both Gaming Rooms',
            'max_participants' => 20,
            'registration_required' => false,
            'is_published' => true,
        ]);

        // Past Events
        Event::create([
            'title' => 'Grand Opening Celebration',
            'slug' => 'grand-opening-celebration',
            'description' => '<p>Thank you to everyone who joined us for our grand opening celebration!</p>

<p>It was an amazing night filled with games, laughter, and the beginning of many new friendships. We had over 50 people join us for tours, demo games, and our special opening night activities.</p>

<h2>Highlights from the Night:</h2>
<ul>
<li>Guided tours of both gaming rooms</li>
<li>Demo sessions of popular RPGs</li>
<li>Board game tournaments</li>
<li>Meet and greet with our game masters</li>
<li>Special opening night prizes</li>
</ul>

<p>We\'re so grateful for the warm welcome from the community and can\'t wait to host many more memorable events!</p>',
            'event_date' => now()->subDays(14),
            'start_time' => '18:00',
            'end_time' => '23:00',
            'location' => 'Both Gaming Rooms',
            'max_participants' => 50,
            'registration_required' => false,
            'is_published' => true,
        ]);

        Event::create([
            'title' => 'Call of Cthulhu One-Shot',
            'slug' => 'call-of-cthulhu-one-shot',
            'description' => '<p>A thrilling investigation into cosmic horror that kept everyone on the edge of their seats!</p>

<p>Our first Call of Cthulhu session was a huge success. Six brave investigators delved into mysteries that challenged their sanity and tested their resolve.</p>

<h2>The Adventure:</h2>
<p>Set in 1920s Boston, the investigators uncovered a conspiracy involving a missing professor, ancient artifacts, and things that should not be. The session featured excellent roleplaying, clever problem-solving, and just the right amount of cosmic dread.</p>

<p>Thanks to all the players who made this such a memorable session!</p>',
            'event_date' => now()->subDays(7),
            'start_time' => '19:00',
            'end_time' => '23:00',
            'location' => 'Rose Garden Room',
            'max_participants' => 6,
            'registration_required' => true,
            'is_published' => true,
        ]);

        // Unpublished event (draft)
        Event::create([
            'title' => 'Holiday Gaming Marathon',
            'slug' => 'holiday-gaming-marathon',
            'description' => '<p>A special holiday event is being planned. More details coming soon!</p>',
            'event_date' => now()->addDays(30),
            'start_time' => '10:00',
            'end_time' => '22:00',
            'location' => 'Both Gaming Rooms',
            'max_participants' => 30,
            'registration_required' => true,
            'is_published' => false,
        ]);
    }
}