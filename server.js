const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// In-memory user store (replace with database in production)
const users = {};

// Passport Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name']
  },
  function(accessToken, refreshToken, profile, done) {
    // Find or create user
    let user = users[profile.id];
    if (!user) {
      user = {
        id: profile.id,
        facebookId: profile.id,
        displayName: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profilePicture: profile.photos ? profile.photos[0].value : null,
        linked: true
      };
      users[profile.id] = user;
    } else {
      // Update profile if already exists
      user.displayName = profile.displayName;
      user.email = profile.emails ? profile.emails[0].value : user.email;
      user.firstName = profile.name.givenName;
      user.lastName = profile.name.familyName;
      user.profilePicture = profile.photos ? profile.photos[0].value : user.profilePicture;
      user.linked = true;
    }
    return done(null, user);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  const user = users[id];
  done(null, user);
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MettaChain PropChain Backend API' });
});

// Facebook OAuth2 Login Endpoint
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
);

// Facebook OAuth2 Callback
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to profile or dashboard
    res.redirect('/profile');
  }
);

// Get current user profile
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: req.user,
      message: 'Profile retrieved successfully'
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout endpoint
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Account linking endpoint (for existing users)
app.post('/auth/link-facebook', (req, res) => {
  // This would typically require the user to be logged in via another method
  // For now, assume we have a user ID from session or token
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // In a real app, you'd redirect to Facebook OAuth here
  // For simplicity, we'll simulate linking
  const user = req.user;
  user.linked = true;
  res.json({
    message: 'Facebook account linked successfully',
    user: user
  });
});

// Profile sync endpoint
app.post('/auth/sync-profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const user = req.user;
  // In a real app, you'd fetch latest profile from Facebook API
  // For now, just return current profile
  res.json({
    message: 'Profile synced successfully',
    user: user
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;