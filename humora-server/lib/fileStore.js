import { mkdir, readFile, rename, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const dataDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'data');

export function resolveDataPath(...segments) {
  return resolve(dataDirectory, ...segments);
}

export async function readJsonFile(filePath, fallbackValue) {
  try {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return fallbackValue;
    }
    throw error;
  }
}

export async function writeJsonFile(filePath, value) {
  await mkdir(dirname(filePath), { recursive: true });
  const tempFilePath = `${filePath}.tmp`;
  await writeFile(tempFilePath, JSON.stringify(value, null, 2), 'utf8');
  await rename(tempFilePath, filePath);
}
