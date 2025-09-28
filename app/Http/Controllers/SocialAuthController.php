<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Validation\ValidationException;

class SocialAuthController extends Controller
{
    /**
     * Redirect to Google OAuth provider.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            $user = $this->findOrCreateUser($googleUser, 'google');
            
            Auth::login($user, true);
            
            return redirect()->intended('/');
            
        } catch (\Exception $e) {
            return redirect('/login')->withErrors([
                'social' => 'Unable to authenticate with Google. Please try again.'
            ]);
        }
    }

    /**
     * Redirect to Facebook OAuth provider.
     */
    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')->redirect();
    }

    /**
     * Handle Facebook OAuth callback.
     */
    public function handleFacebookCallback()
    {
        try {
            $facebookUser = Socialite::driver('facebook')->user();
            
            $user = $this->findOrCreateUser($facebookUser, 'facebook');
            
            Auth::login($user, true);
            
            return redirect()->intended('/');
            
        } catch (\Exception $e) {
            return redirect('/login')->withErrors([
                'social' => 'Unable to authenticate with Facebook. Please try again.'
            ]);
        }
    }

    /**
     * Find or create user from social provider.
     */
    private function findOrCreateUser($socialUser, $provider)
    {
        $providerIdField = $provider . '_id';
        
        // Check if user already exists with this social provider ID
        $user = User::where($providerIdField, $socialUser->getId())->first();
        
        if ($user) {
            return $user;
        }
        
        // Check if user exists with the same email
        $existingUser = User::where('email', $socialUser->getEmail())->first();
        
        if ($existingUser) {
            // Link the social account to existing user
            $existingUser->update([
                $providerIdField => $socialUser->getId()
            ]);
            
            return $existingUser;
        }
        
        // Create new user
        return User::create([
            'name' => $socialUser->getName(),
            'email' => $socialUser->getEmail(),
            'username' => $this->generateUniqueUsername($socialUser->getName()),
            $providerIdField => $socialUser->getId(),
            'password' => Hash::make(Str::random(24)), // Random password for social users
            'email_verified_at' => now(), // Social accounts are considered verified
        ]);
    }

    /**
     * Generate a unique username from the user's name.
     */
    private function generateUniqueUsername($name)
    {
        $baseUsername = Str::slug(Str::lower($name), '');
        $username = $baseUsername;
        $counter = 1;
        
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }
        
        return $username;
    }
}