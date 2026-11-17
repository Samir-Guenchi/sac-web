import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Serves admin uploads saved to public/uploads when no Vercel Blob token is set.
 * `next dev` serves them as static files already; a production build only
 * serves files that existed at build time, so this route covers later uploads
 * on a self-hosted or local `next start`. On Vercel, uploads go to Blob instead.
 */
const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const ROOT = path.join(process.cwd(), 'public', 'uploads');

export async function GET(_request: Request, { params }: RouteContext<'/uploads/[...path]'>) {
  const parts = (await params).path;
  const file = path.resolve(ROOT, ...parts);
  const type = TYPES[path.extname(file).toLowerCase()];
  // Only files inside public/uploads with a known media extension
  if (!type || !file.startsWith(ROOT + path.sep)) return new Response('Not found', { status: 404 });
  try {
    const body = await readFile(file);
    return new Response(body, { headers: { 'content-type': type, 'cache-control': 'public, max-age=31536000, immutable' } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
