import { Router } from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { upsertOAuthUser } from '../db/index.js';
import { signAuthToken } from '../lib/jwt.js';

const trimTrailingSlash = (url) => url?.replace(/\/+$/, '');
const FRONTEND_URL = trimTrailingSlash(process.env.FRONTEND_URL) || 'http://localhost:3000';
const SERVER_URL = trimTrailingSlash(process.env.SERVER_URL) || 'http://localhost:3001';

// ─── Passport strategies ──────────────────────────────────────────────────────

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${SERVER_URL}/api/auth/oauth/github/callback`,
  scope: ['user:email'],
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value ?? null;
    const user = await upsertOAuthUser({
      provider: 'github',
      oauthId: profile.id,
      email,
      name: profile.displayName || profile.username,
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${SERVER_URL}/api/auth/oauth/google/callback`,
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value ?? null;
    const user = await upsertOAuthUser({
      provider: 'google',
      oauthId: profile.id,
      email,
      name: profile.displayName,
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// Minimal serialization — session only lives for the OAuth handshake
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, { id }));

// ─── Router ───────────────────────────────────────────────────────────────────

const router = Router();

function oauthCallback(req, res) {
  const user = req.user;
  if (!user) return res.redirect(`${FRONTEND_URL}/auth/callback?error=oauth-failed`);

  signAuthToken(user.id, user.role).then(token => {
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  }).catch(() => {
    res.redirect(`${FRONTEND_URL}/auth/callback?error=token-failed`);
  });
}

// GitHub
router.get('/github', passport.authenticate('github', { session: true, scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: true, failureRedirect: `${FRONTEND_URL}/login?error=github` }), oauthCallback);

// Google
router.get('/google', passport.authenticate('google', { session: true, scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: true, failureRedirect: `${FRONTEND_URL}/login?error=google` }), oauthCallback);

export { passport };
export default router;
