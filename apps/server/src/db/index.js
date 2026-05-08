import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, and, gte, inArray, sql } from 'drizzle-orm';
import * as schema from './schema.js';

const client = postgres(process.env.DATABASE_URL, { ssl: 'require', max: 10 });
export const db = drizzle(client, { schema });

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUserByEmail(email) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase()));
  return user ?? null;
}

export async function getUserById(id) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
  return user ?? null;
}

export async function getUserBySubscriptionId(subscriptionId) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.dodoSubscriptionId, subscriptionId));
  return user ?? null;
}

export async function createUser(userData) {
  const [user] = await db.insert(schema.users).values(userData).returning();
  return user;
}

export async function updateUser(id, fields) {
  await db.update(schema.users).set({ ...fields, updatedAt: new Date().toISOString() }).where(eq(schema.users.id, id));
}

export async function getUserByOAuthId(provider, oauthId) {
  const [user] = await db.select().from(schema.users)
    .where(and(eq(schema.users.oauthProvider, provider), eq(schema.users.oauthId, oauthId)));
  return user ?? null;
}

export async function upsertOAuthUser({ provider, oauthId, email, name }) {
  const existing = await getUserByOAuthId(provider, oauthId);
  if (existing) return existing;

  const byEmail = email ? await getUserByEmail(email) : null;
  if (byEmail) {
    await updateUser(byEmail.id, { oauthProvider: provider, oauthId });
    return getUserById(byEmail.id);
  }

  const now = new Date().toISOString();
  return createUser({
    id:            (await import('uuid')).v4(),
    name:          name || email?.split('@')[0] || 'User',
    email:         email?.toLowerCase() ?? `${provider}_${oauthId}@oauth.local`,
    passwordHash:  null,
    oauthProvider: provider,
    oauthId,
    plan:          'free',
    role:          'user',
    createdAt:     now,
    updatedAt:     now,
  });
}

// ─── Sites ────────────────────────────────────────────────────────────────────

export async function getSiteByKey(sitekey) {
  const [site] = await db.select().from(schema.sites).where(eq(schema.sites.sitekey, sitekey));
  return site ?? null;
}

export async function getSitesByUserId(userId) {
  return db.select().from(schema.sites)
    .where(and(eq(schema.sites.userId, userId), eq(schema.sites.active, true)));
}

export async function createSite(siteData) {
  const [site] = await db.insert(schema.sites).values(siteData).returning();
  return site;
}

export async function updateSite(sitekey, fields) {
  await db.update(schema.sites).set(fields).where(eq(schema.sites.sitekey, sitekey));
}

export async function incrementSiteCounters(sitekey) {
  await db.update(schema.sites).set({
    verificationsThisMonth: sql`${schema.sites.verificationsThisMonth} + 1`,
    totalVerifications:     sql`${schema.sites.totalVerifications} + 1`,
  }).where(eq(schema.sites.sitekey, sitekey));
}

// ─── Verifications ────────────────────────────────────────────────────────────

export async function createVerification(v) {
  await db.insert(schema.verifications).values(v);
}

export async function getVerifications(sitekeys, cutoffMs) {
  if (!sitekeys.length) return [];
  const cutoff = new Date(cutoffMs).toISOString();
  return db.select().from(schema.verifications).where(
    and(
      inArray(schema.verifications.sitekey, sitekeys),
      gte(schema.verifications.timestamp, cutoff),
    ),
  );
}

// ─── Used tokens (replay prevention) ─────────────────────────────────────────

export async function hasUsedToken(jti) {
  const [row] = await db.select().from(schema.usedTokens).where(eq(schema.usedTokens.jti, jti));
  return !!row;
}

export async function addUsedToken(jti) {
  await db.insert(schema.usedTokens).values({ jti, createdAt: new Date().toISOString() });
}

// ─── API Keys ────────────────────────────────────────────────────────────────

export async function getApiKeysByUserId(userId) {
  return db.select().from(schema.apiKeys).where(eq(schema.apiKeys.userId, userId));
}

export async function getApiKeyById(id) {
  const [key] = await db.select().from(schema.apiKeys).where(eq(schema.apiKeys.id, id));
  return key ?? null;
}

export async function createApiKey(data) {
  const [key] = await db.insert(schema.apiKeys).values(data).returning();
  return key;
}

export async function revokeApiKey(id) {
  await db.update(schema.apiKeys)
    .set({ revokedAt: new Date().toISOString() })
    .where(eq(schema.apiKeys.id, id));
}

// ─── Billing history ──────────────────────────────────────────────────────────

export async function getBillingHistory(userId) {
  return db.select().from(schema.billingHistory).where(eq(schema.billingHistory.userId, userId));
}

export async function addBillingEntry(entry) {
  await db.insert(schema.billingHistory).values(entry);
}
