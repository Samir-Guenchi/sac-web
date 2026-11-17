import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';

const ALLOWED = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif']
]);
const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Stores an uploaded product/editorial image and returns its public URL.
 * Production: Vercel Blob (BLOB_READ_WRITE_TOKEN). Development: public/uploads.
 * Returns null when no file was chosen.
 */
export async function saveImage(file: FormDataEntryValue | null, folder: string): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = ALLOWED.get(file.type);
  if (!ext) throw new Error('Only JPEG, PNG, WebP or AVIF images are accepted.');
  if (file.size > MAX_BYTES) throw new Error('Images must be 8 MB or smaller.');

  const name = `${folder}/${randomUUID()}.${ext}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(name, file, { access: 'public', contentType: file.type });
    return blob.url;
  }
  if (process.env.VERCEL) throw new Error('BLOB_READ_WRITE_TOKEN is not configured.');

  const target = path.join(process.cwd(), 'public', 'uploads', name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
