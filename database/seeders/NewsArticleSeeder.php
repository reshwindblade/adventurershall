<?php

namespace Database\Seeders;

use App\Models\NewsArticle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NewsArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        NewsArticle::create([
            'title' => 'Welcome to Adventurers\' Hall!',
            'slug' => 'welcome-to-adventurers-hall',
            'content' => '<p>We\'re thrilled to announce the grand opening of Adventurers\' Hall, your new home for tabletop gaming and RPG adventures!</p>

<p>After months of preparation, we\'re finally ready to welcome you into our beautifully designed gaming spaces. Whether you\'re looking to book a private room for your regular gaming group or want to try your hand at a new TTRPG system with one of our experienced instructors, we have something for everyone.</p>

<h2>What to Expect</h2>
<ul>
<li>Two themed gaming rooms: Rose Garden and Obsidian Sanctuary</li>
<li>Professional game masters for guided sessions</li>
<li>A welcoming community of fellow adventurers</li>
<li>Regular events and tournaments</li>
</ul>

<p>We can\'t wait to see what stories you\'ll create within our walls. Book your first adventure today!</p>',
            'excerpt' => 'We\'re thrilled to announce the grand opening of Adventurers\' Hall, your new home for tabletop gaming and RPG adventures!',
            'is_published' => true,
            'published_at' => now()->subDays(7),
        ]);

        NewsArticle::create([
            'title' => 'New TTRPG Systems Added to Our Library',
            'slug' => 'new-ttrpg-systems-added',
            'content' => '<p>We\'ve expanded our collection of tabletop RPG systems to include some exciting new options for our guided sessions!</p>

<h2>New Additions Include:</h2>
<ul>
<li><strong>Blades in the Dark:</strong> A game of daring scoundrels in a haunted industrial city</li>
<li><strong>Monster of the Week:</strong> Hunt monsters in the style of Supernatural, Buffy, and X-Files</li>
<li><strong>Powered by the Apocalypse games:</strong> Including Dungeon World and Apocalypse World</li>
<li><strong>Call of Cthulhu:</strong> Investigate cosmic horrors in this classic horror RPG</li>
</ul>

<p>Our experienced game masters are ready to guide you through these systems, whether you\'re a complete beginner or looking to try something new. Each system offers a unique gameplay experience and storytelling style.</p>

<p>Book a guided session today and discover your new favorite game!</p>',
            'excerpt' => 'We\'ve expanded our collection of tabletop RPG systems with exciting new options including Blades in the Dark, Monster of the Week, and more!',
            'is_published' => true,
            'published_at' => now()->subDays(3),
        ]);

        NewsArticle::create([
            'title' => 'Monthly Tournament Series Announced',
            'slug' => 'monthly-tournament-series-announced',
            'content' => '<p>Get ready to test your skills! We\'re launching a monthly tournament series featuring different games each month.</p>

<h2>Tournament Schedule</h2>
<ul>
<li><strong>January:</strong> Magic: The Gathering Draft Tournament</li>
<li><strong>February:</strong> Settlers of Catan Championship</li>
<li><strong>March:</strong> D&D 5e One-Shot Competition</li>
<li><strong>April:</strong> Board Game Medley Tournament</li>
</ul>

<p>Each tournament will feature prizes for the top three finishers, including gift cards, exclusive merchandise, and bragging rights!</p>

<h2>How to Participate</h2>
<p>Registration opens two weeks before each tournament. Entry fees are minimal and go toward prize support. All skill levels are welcome - we\'ll have separate brackets for beginners and experienced players where appropriate.</p>

<p>Stay tuned for more details on our first tournament coming this January!</p>',
            'excerpt' => 'We\'re launching a monthly tournament series featuring different games each month, with prizes and fun for all skill levels!',
            'is_published' => true,
            'published_at' => now()->subDays(1),
        ]);

        // Draft article (not published)
        NewsArticle::create([
            'title' => 'Upcoming Holiday Events',
            'slug' => 'upcoming-holiday-events',
            'content' => '<p>We\'re planning some special holiday events for the community. Stay tuned for more details!</p>',
            'excerpt' => 'Special holiday events are being planned for the community.',
            'is_published' => false,
            'published_at' => null,
        ]);
    }
}