import { pgTable, text, integer, boolean, numeric, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id:                    uuid('id').primaryKey(),
  name:                  text('name').notNull(),
  email:                 text('email').notNull().unique(),
  passwordHash:          text('password_hash'),
  oauthProvider:         text('oauth_provider'),
  oauthId:               text('oauth_id'),
  plan:                  text('plan').notNull().default('free'),
  role:                  text('role').notNull().default('user'),
  dodoCustomerId:        text('dodo_customer_id'),
  dodoSubscriptionId:    text('dodo_subscription_id'),
  subscriptionStatus:    text('subscription_status').notNull().default('none'),
  subscriptionEndsAt:    text('subscription_ends_at'),
  cancelAtPeriodEnd:     boolean('cancel_at_period_end').notNull().default(false),
  paymentMethodLast4:    text('payment_method_last4'),
  paymentMethodBrand:    text('payment_method_brand'),
  paymentMethodExpiry:   text('payment_method_expiry'),
  createdAt:             text('created_at').notNull(),
  updatedAt:             text('updated_at').notNull(),
});

export const sites = pgTable('sites', {
  sitekey:                  text('sitekey').primaryKey(),
  domain:                   text('domain').notNull(),
  environment:              text('environment').notNull(),
  userId:                   uuid('user_id').notNull().references(() => users.id),
  active:                   boolean('active').notNull().default(true),
  verificationsThisMonth:   integer('verifications_this_month').notNull().default(0),
  totalVerifications:       integer('total_verifications').notNull().default(0),
  createdAt:                text('created_at').notNull(),
});

export const verifications = pgTable('verifications', {
  sessionId: text('session_id').primaryKey(),
  sitekey:   text('sitekey').notNull().references(() => sites.sitekey),
  score:     integer('score'),
  verdict:   text('verdict'),
  token:     text('token'),
  used:      boolean('used').notNull().default(false),
  timestamp: text('timestamp').notNull(),
  domain:    text('domain'),
});

export const usedTokens = pgTable('used_tokens', {
  jti:       text('jti').primaryKey(),
  createdAt: text('created_at').notNull(),
});

export const billingHistory = pgTable('billing_history', {
  id:                 uuid('id').primaryKey(),
  userId:             uuid('user_id').notNull().references(() => users.id),
  plan:               text('plan'),
  amount:             numeric('amount'),
  currency:           text('currency'),
  status:             text('status'),
  createdAt:          text('created_at').notNull(),
  dodoSubscriptionId: text('dodo_subscription_id'),
});
