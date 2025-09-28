<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Tests\TestCase;

class SocialAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_user_can_redirect_to_google_oauth()
    {
        $response = $this->get('/auth/google');
        
        $this->assertEquals(302, $response->getStatusCode());
    }

    public function test_user_can_redirect_to_facebook_oauth()
    {
        $response = $this->get('/auth/facebook');
        
        $this->assertEquals(302, $response->getStatusCode());
    }

    public function test_user_can_authenticate_with_google()
    {
        $socialiteUser = Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn('123456789');
        $socialiteUser->shouldReceive('getName')->andReturn('John Doe');
        $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');

        $socialiteProvider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $socialiteProvider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($socialiteProvider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/');
        $this->assertAuthenticated();

        $user = User::where('email', 'john@example.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('123456789', $user->google_id);
        $this->assertEquals('John Doe', $user->name);
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_user_can_authenticate_with_facebook()
    {
        $socialiteUser = Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn('987654321');
        $socialiteUser->shouldReceive('getName')->andReturn('Jane Smith');
        $socialiteUser->shouldReceive('getEmail')->andReturn('jane@example.com');

        $socialiteProvider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $socialiteProvider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('facebook')->andReturn($socialiteProvider);

        $response = $this->get('/auth/facebook/callback');

        $response->assertRedirect('/');
        $this->assertAuthenticated();

        $user = User::where('email', 'jane@example.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('987654321', $user->facebook_id);
        $this->assertEquals('Jane Smith', $user->name);
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_existing_user_can_link_google_account()
    {
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com',
            'google_id' => null,
        ]);

        $socialiteUser = Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn('123456789');
        $socialiteUser->shouldReceive('getName')->andReturn('Existing User');
        $socialiteUser->shouldReceive('getEmail')->andReturn('existing@example.com');

        $socialiteProvider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $socialiteProvider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($socialiteProvider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/');
        $this->assertAuthenticated();

        $existingUser->refresh();
        $this->assertEquals('123456789', $existingUser->google_id);
    }

    public function test_existing_user_can_link_facebook_account()
    {
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com',
            'facebook_id' => null,
        ]);

        $socialiteUser = Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn('987654321');
        $socialiteUser->shouldReceive('getName')->andReturn('Existing User');
        $socialiteUser->shouldReceive('getEmail')->andReturn('existing@example.com');

        $socialiteProvider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $socialiteProvider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('facebook')->andReturn($socialiteProvider);

        $response = $this->get('/auth/facebook/callback');

        $response->assertRedirect('/');
        $this->assertAuthenticated();

        $existingUser->refresh();
        $this->assertEquals('987654321', $existingUser->facebook_id);
    }

    public function test_social_user_with_existing_social_id_logs_in()
    {
        $existingUser = User::factory()->create([
            'google_id' => '123456789',
        ]);

        $socialiteUser = Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn('123456789');
        $socialiteUser->shouldReceive('getName')->andReturn('John Doe');
        $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');

        $socialiteProvider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $socialiteProvider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($socialiteProvider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/');
        $this->assertAuthenticatedAs($existingUser);
    }

    public function test_unique_username_generation()
    {
        // Create a user with username 'johndoe'
        User::factory()->create(['username' => 'johndoe']);

        $socialiteUser = Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn('123456789');
        $socialiteUser->shouldReceive('getName')->andReturn('John Doe');
        $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');

        $socialiteProvider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $socialiteProvider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($socialiteProvider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/');
        $this->assertAuthenticated();

        $user = User::where('email', 'john@example.com')->first();
        $this->assertEquals('johndoe1', $user->username);
    }

    public function test_social_authentication_handles_errors_gracefully()
    {
        $socialiteProvider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $socialiteProvider->shouldReceive('user')->andThrow(new \Exception('OAuth error'));

        Socialite::shouldReceive('driver')->with('google')->andReturn($socialiteProvider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors(['social']);
        $this->assertGuest();
    }
}