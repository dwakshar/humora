// Re-exports from the DB layer — keeps old import paths working.
export {
  getUserByEmail,
  getUserById,
  getUserBySubscriptionId,
  createUser,
  updateUser,
  getSiteByKey,
  getSitesByUserId,
  createSite,
  updateSite,
  incrementSiteCounters,
  createVerification,
  getVerifications,
  hasUsedToken,
  addUsedToken,
  getBillingHistory,
  addBillingEntry,
} from '../db/index.js';
