function stripProtocol(value) {
  return value.replace(/^https?:\/\//, '').replace(/^www\./, '');
}

export function normalizeDomain(input) {
  if (typeof input !== 'string' || input.trim() === '') return '';
  const value = input.trim().toLowerCase();

  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`);
    return stripProtocol(url.hostname);
  } catch {
    return stripProtocol(value.split('/')[0]);
  }
}

export function normalizeOrigin(input) {
  if (typeof input !== 'string' || input.trim() === '') return '';
  try {
    const url = new URL(input);
    return url.origin.toLowerCase();
  } catch {
    return '';
  }
}

export function originMatchesDomain(origin, expectedDomain) {
  const normalizedDomain = normalizeDomain(expectedDomain);
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedDomain || !normalizedOrigin) return false;

  const originHost = normalizeDomain(normalizedOrigin);
  return originHost === normalizedDomain || originHost.endsWith(`.${normalizedDomain}`);
}

export function isAllowedRegistrationDomain(domain) {
  const normalizedDomain = normalizeDomain(domain);
  if (!normalizedDomain) return false;
  if (normalizedDomain === 'localhost') return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(normalizedDomain)) return true;
  return /^[a-z0-9.-]+$/.test(normalizedDomain);
}
