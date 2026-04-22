# MettaChain-PropChain-BackEnd

Backend API for MettaChain PropChain with Facebook OAuth2 authentication.

## Features

- Facebook OAuth2 Login
- User profile management
- Account linking
- Profile synchronization

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Facebook OAuth2:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or use existing one
   - Add Facebook Login product
   - Get your App ID and App Secret
   - Set the callback URL to: `http://localhost:3000/auth/facebook/callback`

3. Create `.env` file with your configuration:
   ```
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   SESSION_SECRET=your_random_session_secret
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `GET /auth/facebook` - Initiate Facebook OAuth2 login
- `GET /auth/facebook/callback` - OAuth2 callback (handled automatically)
- `GET /logout` - Logout user

### User Management
- `GET /profile` - Get current user profile (requires authentication)
- `POST /auth/link-facebook` - Link Facebook account to existing user
- `POST /auth/sync-profile` - Sync user profile with Facebook

## Testing

1. Start the server
2. Visit `http://localhost:3000/auth/facebook` in your browser
3. Complete Facebook login
4. You'll be redirected to `/profile` with user data

## Acceptance Criteria

- ✅ OAuth2 config (Facebook app setup and environment variables)
- ✅ Login endpoint (`/auth/facebook`)
- ✅ Account linking (`/auth/link-facebook`)
- ✅ Profile sync (`/auth/sync-profile`)