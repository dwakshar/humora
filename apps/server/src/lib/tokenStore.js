import { readJsonFile, resolveDataPath, writeJsonFile } from './fileStore.js';

const TOKEN_FILE_PATH = resolveDataPath('used-tokens.json');

async function listUsedTokens() {
  return readJsonFile(TOKEN_FILE_PATH, []);
}

export async function hasUsedToken(tokenId) {
  if (!tokenId) return false;
  const now = Date.now();
  const tokens = await listUsedTokens();
  const validTokens = tokens.filter((entry) => entry.expiresAt > now);
  if (validTokens.length !== tokens.length) {
    await writeJsonFile(TOKEN_FILE_PATH, validTokens);
  }
  return validTokens.some((entry) => entry.tokenId === tokenId);
}

export async function markTokenUsed(tokenId, expiresAt) {
  const tokens = await listUsedTokens();
  const now = Date.now();
  const nextTokens = tokens
    .filter((entry) => entry.expiresAt > now && entry.tokenId !== tokenId)
    .concat([{ tokenId, expiresAt }]);
  await writeJsonFile(TOKEN_FILE_PATH, nextTokens);
}
