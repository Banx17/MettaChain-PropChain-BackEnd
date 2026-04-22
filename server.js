const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
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

// In-memory user storage (replace with database in production)
let users = [];
let linkedAccounts = {};

// Passport Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'picture']
  },
  function(accessToken, refreshToken, profile, done) {
    // Find or create user
    let user = users.find(u => u.facebookId === profile.id);
    if (!user) {
      user = {
        id: users.length + 1,
        facebookId: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profilePicture: profile.photos ? profile.photos[0].value : null,
        linkedAccounts: []
      };
      users.push(user);
    }
    return done(null, user);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Routes

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'MettaChain PropChain Backend API', user: req.user });
});

// Facebook OAuth2 login endpoint
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
);

// Facebook OAuth2 callback
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to profile or dashboard
    res.redirect('/profile');
  }
);

// Logout endpoint
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Profile endpoint (requires authentication)
app.get('/profile', ensureAuthenticated, (req, res) => {
  res.json({
    user: req.user,
    message: 'Profile data retrieved successfully'
  });
});

// Account linking endpoint
app.post('/auth/link-account', ensureAuthenticated, (req, res) => {
  const { provider, accountId } = req.body;
  const userId = req.user.id;

  if (!linkedAccounts[userId]) {
    linkedAccounts[userId] = [];
  }

  // Check if account is already linked
  const existingLink = linkedAccounts[userId].find(link => link.provider === provider && link.accountId === accountId);
  if (existingLink) {
    return res.status(400).json({ error: 'Account already linked' });
  }

  linkedAccounts[userId].push({
    provider,
    accountId,
    linkedAt: new Date()
  });

  res.json({ message: 'Account linked successfully', linkedAccounts: linkedAccounts[userId] });
});

// Get linked accounts
app.get('/auth/linked-accounts', ensureAuthenticated, (req, res) => {
  const userId = req.user.id;
  res.json({ linkedAccounts: linkedAccounts[userId] || [] });
});

// Profile sync endpoint
app.post('/auth/sync-profile', ensureAuthenticated, (req, res) => {
  const { name, email, firstName, lastName } = req.body;
  const user = req.user;

  // Update user profile
  if (name) user.name = name;
  if (email) user.email = email;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;

  // Update in users array
  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex] = user;
  }

  res.json({ message: 'Profile synced successfully', user });
});

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Facebook OAuth2 configured with callback: ${process.env.FACEBOOK_CALLBACK_URL}`);
});

module.exports = app;