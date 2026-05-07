import * as FileSystem from 'expo-file-system';

const IMAGES_DIR = `${FileSystem.documentDirectory}images`;

function getFileExtensionFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    const last = path.split('/').pop() || '';
    const parts = last.split('.');
    if (parts.length > 1) return parts.pop()!.toLowerCase();
    return 'png';
  } catch {
    return 'png';
  }
}

function getStableKeyFromUrl(url: string): string {
  try {
    const u = new URL(url);
    // Use only pathname as a stable key (ignore query tokens)
    const base = u.pathname;
    // djb2 simple hash
    let hash = 5381;
    for (let i = 0; i < base.length; i++) {
      hash = (hash * 33) ^ base.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
  } catch {
    // Fallback to encode URI
    return encodeURIComponent(url);
  }
}

function getFileUriForRemote(remoteUrl: string): string {
  const ext = getFileExtensionFromUrl(remoteUrl);
  const key = getStableKeyFromUrl(remoteUrl);
  return `${IMAGES_DIR}/${key}.${ext}`;
}

async function ensureDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(IMAGES_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
  }
}

export async function getCachedImageUri(remoteUrl: string): Promise<string> {
  try {
    await ensureDir();
    const fileUri = getFileUriForRemote(remoteUrl);

    const info = await FileSystem.getInfoAsync(fileUri);
    if (info.exists && info.size && info.size > 0) {
      return fileUri;
    }

    const result = await FileSystem.downloadAsync(remoteUrl, fileUri);
    if (result.status === 200) {
      return fileUri;
    }

    // downloadAsync writes the response body to disk regardless of status —
    // remove the corrupt file so we don't serve it from cache next time.
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
    return remoteUrl;
  } catch (e) {
    console.warn('[imageCache] error', e);
    return remoteUrl;
  }
}

export async function invalidateCachedImage(remoteUrl: string): Promise<void> {
  try {
    const fileUri = getFileUriForRemote(remoteUrl);
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
  } catch (e) {
    console.warn('[imageCache] invalidate error', e);
  }
}
