import { randomBytes } from 'crypto';
import { readJsonFile, resolveDataPath, writeJsonFile } from './fileStore.js';

const SITE_FILE_PATH = resolveDataPath('sites.json');

function generateSitekey() {
  return `sk_live_${randomBytes(16).toString('hex')}`;
}

export async function listSites() {
  return readJsonFile(SITE_FILE_PATH, []);
}

export async function findSiteByKey(sitekey) {
  const sites = await listSites();
  return sites.find((site) => site.sitekey === sitekey) || null;
}

export async function findSiteByDomain(domain) {
  const sites = await listSites();
  return sites.find((site) => site.domain === domain) || null;
}

export async function registerSite({ domain, email }) {
  const sites = await listSites();
  const existingSite = sites.find((site) => site.domain === domain);
  if (existingSite) {
    return existingSite;
  }

  const site = {
    sitekey: generateSitekey(),
    domain,
    email,
    createdAt: Date.now(),
  };

  sites.push(site);
  await writeJsonFile(SITE_FILE_PATH, sites);
  return site;
}
