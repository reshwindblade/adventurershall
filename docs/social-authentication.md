# Social Authentication Setup

This document explains how to configure Google and Facebook OAuth authentication for the Adventurers' Hall website.

## Environment Configuration

Add the following environment variables to your `.env` file:

```env
# Social Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:8000/auth/facebook/callback
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Add your domain to authorized origins
6. Add the callback URL: `http://your-domain.com/auth/google/callback`
7. Copy the Client ID and Client Secret to your `.env` file

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add Facebook Login product to your app
4. In Facebook Login settings, add the callback URL: `http://your-domain.com/auth/facebook/callback`
5. Copy the App ID and App Secret to your `.env` file

## Features

- **New User Registration**: Users can create accounts using Google or Facebook
- **Account Linking**: Existing users can link their social accounts to their existing email
- **Automatic Login**: Users with linked social accounts can log in with one click
- **Unique Username Generation**: Automatically generates unique usernames from social profile names
- **Error Handling**: Graceful error handling for OAuth failures

## Security Features

- Social accounts are automatically marked as email verified
- Random passwords are generated for social-only accounts
- Proper error handling prevents information disclosure
- Account linking is based on email address matching

## Testing

Run the social authentication tests:

```bash
php artisan test tests/Feature/SocialAuthenticationTest.php
```

## Usage

Social login buttons are automatically displayed on the login and registration pages. Users can:

1. Click "Google" or "Facebook" button
2. Complete OAuth flow on the respective platform
3. Be redirected back to the application and automatically logged in
4. If they have an existing account with the same email, it will be linked automatically