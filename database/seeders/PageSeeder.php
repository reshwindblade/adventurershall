<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Page::create([
            'slug' => 'home',
            'title' => 'Welcome to Adventurers\' Hall',
            'content' => '<h1>Welcome to Adventurers\' Hall</h1>
<p>Your premier destination for tabletop gaming and RPG adventures! Whether you\'re a seasoned veteran or just starting your journey into the world of tabletop gaming, Adventurers\' Hall provides the perfect space for epic adventures.</p>

<h2>What We Offer</h2>
<ul>
<li>Private gaming rooms for your group</li>
<li>Guided TTRPG sessions for beginners</li>
<li>A welcoming community of gamers</li>
<li>Regular events and tournaments</li>
</ul>

<p>Book your adventure today and discover why Adventurers\' Hall is the heart of the local gaming community!</p>',
            'meta_description' => 'Welcome to Adventurers\' Hall - your premier tabletop gaming cafe. Book private rooms, join guided sessions, and become part of our gaming community.',
            'is_published' => true,
        ]);

        Page::create([
            'slug' => 'about',
            'title' => 'About Adventurers\' Hall',
            'content' => '<h1>About Adventurers\' Hall</h1>
<p>Founded by passionate gamers for passionate gamers, Adventurers\' Hall is more than just a gaming cafe - it\'s a community hub where stories come to life and friendships are forged through shared adventures.</p>

<h2>Our Mission</h2>
<p>We believe that tabletop gaming brings people together in ways that digital entertainment simply cannot match. Our mission is to provide a welcoming, inclusive space where players of all experience levels can discover the joy of collaborative storytelling and strategic gameplay.</p>

<h2>Our Spaces</h2>
<p>We offer two beautifully designed gaming rooms:</p>
<ul>
<li><strong>Rose Garden:</strong> Perfect for intimate groups up to 6 players</li>
<li><strong>Obsidian Sanctuary:</strong> Ideal for larger parties up to 10 players</li>
</ul>

<h2>Our Community</h2>
<p>At Adventurers\' Hall, we\'re committed to fostering an inclusive environment where everyone feels welcome. Whether you\'re rolling dice for the first time or you\'ve been gaming for decades, you\'ll find your place at our table.</p>',
            'meta_description' => 'Learn about Adventurers\' Hall - our mission, our spaces, and our commitment to building an inclusive tabletop gaming community.',
            'is_published' => true,
        ]);
    }
}
