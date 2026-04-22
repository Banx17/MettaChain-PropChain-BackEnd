# MettaChain-PropChain-BackEnd

A Node.js Express backend with Facebook OAuth2 authentication.

## Features

- Facebook OAuth2 authentication
- User profile management
- Account linking functionality
- Profile synchronization

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Facebook OAuth2:
   - Create a Facebook App at [Facebook Developers](https://developers.facebook.com/)
   - Get your App ID and App Secret
   - Update `.env` file with your credentials:
     ```
     FACEBOOK_APP_ID=your_facebook_app_id
     FACEBOOK_APP_SECRET=your_facebook_app_secret
     ```

3. Start the server:
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `GET /auth/facebook` - Initiate Facebook login
- `GET /auth/facebook/callback` - Facebook OAuth callback
- `GET /logout` - Logout user

### User Management
- `GET /profile` - Get user profile (requires authentication)
- `POST /auth/link-account` - Link additional accounts
- `GET /auth/linked-accounts` - Get linked accounts
- `POST /auth/sync-profile` - Sync user profile data

## Usage

1. Visit `http://localhost:3000/auth/facebook` to start OAuth flow
2. After authentication, you'll be redirected to `/profile`
3. Use the API endpoints to manage user data and account linking

## Troubleshooting

- **Facebook App Configuration**: Ensure your Facebook app has the correct callback URL set
- **Environment Variables**: Make sure all required environment variables are set in `.env`
- **CORS Issues**: The app includes CORS middleware for cross-origin requests
- **Session Management**: Uses express-session for maintaining user sessions

## Security Notes

This is a basic implementation. For production use:
- Replace in-memory storage with a proper database
- Implement proper error handling and logging
- Add rate limiting and security middleware
- Use HTTPS in production
- Validate and sanitize all inputs