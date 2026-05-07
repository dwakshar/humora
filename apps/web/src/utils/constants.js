export const API_BASE =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:3001' : '')

export const WIDGET_URL =
  import.meta.env.VITE_WIDGET_URL ||
  'http://localhost:5173/humora.min.js'

export const PLANS = {
  FREE: {
    name:   'Free',
    price:  { monthly: 0, annual: 0 },
    limits: { verifications: 1000, domains: 1 }
  },
  STARTER: {
    name:   'Starter',
    price:  { monthly: 9, annual: 7 },
    limits: { verifications: 10000, domains: 3 }
  },
  PRO: {
    name:   'Pro',
    price:  { monthly: 29, annual: 23 },
    limits: { verifications: 100000, domains: -1 }
  },
  ENTERPRISE: {
    name:   'Enterprise',
    price:  { monthly: null, annual: null },
    limits: { verifications: -1, domains: -1 }
  }
}

export const ROUTES = {
  HOME:       '/',
  PRICING:    '/pricing',
  DEMO:       '/demo',
  DOCS:       '/docs',
  LOGIN:      '/login',
  SIGNUP:     '/signup',
  FORGOT:     '/forgot-password',
  ONBOARDING: '/onboarding',
  DASHBOARD:  '/dashboard',
  ANALYTICS:  '/dashboard/analytics',
  SITES:      '/dashboard/sites',
  BILLING:    '/dashboard/billing',
  SETTINGS:   '/dashboard/settings',
}

export const SCORE_THRESHOLDS = {
  PASS:       50,
  BORDERLINE: 35,
  MAX:        70,
}

export const PERSONALITY_LINES = [
  'Chaotically empathetic. Definitely not a bot.',
  'Gloriously irrational. Verified human.',
  'Delightfully overthinking it. As expected.',
  'Suspiciously relatable. In a good way.',
  'Emotionally complex. Bots wish they were you.',
  'Beautifully unpredictable. That\'s very human.',
]
