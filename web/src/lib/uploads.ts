import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const UPLOAD_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
  ['video/mp4', 'mp4'],
  ['video/webm', 'webm']
]);
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

/** Production stores files in Vercel Blob (uploaded directly from the browser). */
export const blobUploadsEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/**
 * Development fallback: saves an upload under public/uploads and returns its URL.
 * Refused on Vercel, where the filesystem is read-only and Blob must be configured.
 */
export async function saveLocalUpload(file: File, folder: string): Promise<string> {
  const ext = UPLOAD_TYPES.get(file.type);
  if (!ext) throw new Error('Unsupported file type. Use JPEG, PNG, WebP, AVIF, MP4 or WebM.');
  const limit = file.type.startsWith('video/') ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) throw new Error(`File too large (max ${Math.round(limit / 1024 / 1024)} MB).`);
  if (process.env.VERCEL) throw new Error('BLOB_READ_WRITE_TOKEN is not configured.');

  const safeFolder = folder.replace(/[^a-z0-9-]/gi, '') || 'misc';
  const name = `${safeFolder}/${randomUUID()}.${ext}`;
  const target = path.join(process.cwd(), 'public', 'uploads', name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
