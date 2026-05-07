import { Router } from 'express';
import express from 'express';
import DodoPayments from 'dodopayments';
import { authenticate } from '../middleware/auth.js';
import { getSitesByUserId, updateUser, getUserById, getUserBySubscriptionId, addBillingEntry, getBillingHistory } from '../db/index.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_SECRET_KEY,
  environment: process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
});

const PRODUCT_IDS = {
  starter_monthly: process.env.DODO_PRODUCT_STARTER_MONTHLY,
  starter_annual:  process.env.DODO_PRODUCT_STARTER_ANNUAL,
  pro_monthly:     process.env.DODO_PRODUCT_PRO_MONTHLY,
  pro_annual:      process.env.DODO_PRODUCT_PRO_ANNUAL,
};

const PLAN_LIMITS = {
  free:       { verifications: 1000,   domains: 1 },
  starter:    { verifications: 10000,  domains: 3 },
  pro:        { verifications: 100000, domains: -1 },
  enterprise: { verifications: -1,     domains: -1 },
};

// ─── GET /api/billing ─────────────────────────────────────────────────────────

router.get('/', apiLimiter, authenticate, async (req, res) => {
  try {
    const user      = req.user;
    const userSites = await getSitesByUserId(req.userId);

    const verificationsThisMonth = userSites.reduce((sum, s) => sum + (s.verificationsThisMonth ?? 0), 0);
    const domainsActive = userSites.filter((s) => s.active).length;

    res.json({
      plan:   user.plan ?? 'free',
      limits: PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free,
      usage:  { verificationsThisMonth, domainsActive },
      subscription: {
        id:                user.dodoSubscriptionId ?? null,
        status:            user.subscriptionStatus ?? 'none',
        currentPeriodEnd:  user.subscriptionEndsAt ?? null,
        cancelAtPeriodEnd: user.cancelAtPeriodEnd ?? false,
      },
      paymentMethod: user.paymentMethodLast4
        ? { last4: user.paymentMethodLast4, brand: user.paymentMethodBrand, expiry: user.paymentMethodExpiry }
        : null,
    });
  } catch (error) {
    console.error('Billing status error:', error);
    res.status(500).json({ error: 'Failed to retrieve billing status' });
  }
});

// ─── POST /api/billing/checkout ───────────────────────────────────────────────

router.post('/checkout', apiLimiter, authenticate, async (req, res) => {
  try {
    const { plan, period } = req.body;

    if (!['starter', 'pro'].includes(plan) || !['monthly', 'annual'].includes(period)) {
      return res.status(400).json({ error: 'Invalid plan or period' });
    }

    const productId = PRODUCT_IDS[`${plan}_${period}`];
    if (!productId) return res.status(400).json({ error: 'Invalid plan' });

    const payment = await dodo.subscriptions.create({
      billing:    { city: '—', country: 'US', state: '—', street: '—', zipcode: '00000' },
      customer:   { email: req.user.email, name: req.user.name },
      product_id: productId,
      quantity:   1,
      return_url: `${process.env.FRONTEND_URL}/dashboard/billing?success=true`,
      metadata:   { userId: req.userId, plan, period },
    });

    res.json({ checkoutUrl: payment.payment_link, subscriptionId: payment.subscription_id });
  } catch (error) {
    console.error('Dodo checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// ─── POST /api/billing/webhook ────────────────────────────────────────────────

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let webhookEvent;
  try {
    webhookEvent = dodo.webhooks.constructEvent(
      req.body,
      req.headers['webhook-id'],
      req.headers['webhook-signature'],
      req.headers['webhook-timestamp'],
      process.env.DODO_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  try {
    const payload = webhookEvent.data;

    switch (webhookEvent.type) {
      case 'subscription.active': {
        const userId = payload.metadata?.userId;
        const plan   = payload.metadata?.plan;
        if (userId) {
          await updateUser(userId, {
            plan,
            dodoSubscriptionId: payload.subscription_id,
            dodoCustomerId:     payload.customer?.customer_id,
            subscriptionStatus: 'active',
            subscriptionEndsAt: payload.current_period_end,
            cancelAtPeriodEnd:  false,
          });
          await addBillingEntry({
            id:                 uuidv4(),
            userId,
            plan,
            amount:             String((payload.total_amount ?? 0) / 100),
            currency:           payload.currency ?? 'USD',
            status:             'paid',
            createdAt:          new Date().toISOString(),
            dodoSubscriptionId: payload.subscription_id,
          });
        }
        break;
      }

      case 'subscription.cancelled': {
        const user = await getUserBySubscriptionId(payload.subscription_id);
        if (user) {
          await updateUser(user.id, {
            plan:               'free',
            subscriptionStatus: 'cancelled',
            dodoSubscriptionId: null,
            cancelAtPeriodEnd:  false,
          });
        }
        break;
      }

      case 'subscription.renewed': {
        const user = await getUserBySubscriptionId(payload.subscription_id);
        if (user) {
          await updateUser(user.id, {
            subscriptionStatus: 'active',
            subscriptionEndsAt: payload.current_period_end,
          });
          await addBillingEntry({
            id:                 uuidv4(),
            userId:             user.id,
            plan:               user.plan,
            amount:             String((payload.total_amount ?? 0) / 100),
            currency:           payload.currency ?? 'USD',
            status:             'paid',
            createdAt:          new Date().toISOString(),
            dodoSubscriptionId: payload.subscription_id,
          });
        }
        break;
      }

      case 'subscription.failed': {
        const user = await getUserBySubscriptionId(payload.subscription_id);
        if (user) {
          await updateUser(user.id, { subscriptionStatus: 'past_due' });
          console.error('Payment failed for user:', user.id);
        }
        break;
      }

      case 'payment.succeeded':
        console.log('Payment succeeded:', payload.payment_id);
        break;

      default:
        console.log('Unhandled Dodo webhook event type:', webhookEvent.type);
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
  }

  res.json({ received: true });
});

// ─── POST /api/billing/cancel ─────────────────────────────────────────────────

router.post('/cancel', apiLimiter, authenticate, async (req, res) => {
  try {
    if (!req.user.dodoSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription' });
    }

    await dodo.subscriptions.update(req.user.dodoSubscriptionId, { cancel_at_next_billing_date: true });
    await updateUser(req.userId, { cancelAtPeriodEnd: true });

    res.json({ success: true, cancelAtPeriodEnd: true, message: 'Subscription will cancel at end of billing period' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// ─── POST /api/billing/reactivate ────────────────────────────────────────────

router.post('/reactivate', apiLimiter, authenticate, async (req, res) => {
  try {
    if (!req.user.cancelAtPeriodEnd) {
      return res.status(400).json({ error: 'Subscription is not set to cancel' });
    }

    await dodo.subscriptions.update(req.user.dodoSubscriptionId, { cancel_at_next_billing_date: false });
    await updateUser(req.userId, { cancelAtPeriodEnd: false });

    res.json({ success: true, message: 'Subscription reactivated successfully' });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    res.status(500).json({ error: 'Failed to reactivate subscription' });
  }
});

// ─── GET /api/billing/history ─────────────────────────────────────────────────

router.get('/history', apiLimiter, authenticate, async (req, res) => {
  try {
    const invoices = (await getBillingHistory(req.userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(({ id, plan, amount, currency, status, createdAt, dodoSubscriptionId }) => ({
        id, plan, amount, currency, status, createdAt, dodoSubscriptionId,
      }));

    res.json({ invoices });
  } catch (error) {
    console.error('Billing history error:', error);
    res.status(500).json({ error: 'Failed to retrieve billing history' });
  }
});

// ─── GET /api/billing/portal ──────────────────────────────────────────────────

router.get('/portal', apiLimiter, authenticate, async (req, res) => {
  try {
    if (!req.user.dodoCustomerId) {
      return res.status(400).json({ error: 'No billing account found' });
    }

    const portal = await dodo.customerPortal.create({
      customer_id: req.user.dodoCustomerId,
      return_url:  `${process.env.FRONTEND_URL}/dashboard/billing`,
    });

    res.json({ portalUrl: portal.url });
  } catch (error) {
    console.error('Customer portal error:', error);
    res.status(500).json({ error: 'Failed to create billing portal session' });
  }
});

export default router;
