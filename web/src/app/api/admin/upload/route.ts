import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { blobUploadsEnabled, MAX_VIDEO_BYTES, saveLocalUpload, UPLOAD_TYPES } from '@/lib/uploads';

async function isAdmin() {
  const user = await getSessionUser();
  return user?.role === 'admin';
}

/** Tells the admin UI which upload mode to use. */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ mode: blobUploadsEnabled() ? 'blob' : 'local' });
}

/**
 * - JSON body: Vercel Blob client-upload handshake. The browser uploads the file
 *   straight to Blob with a short-lived token issued here, only to admins.
 * - multipart body: development fallback that stores the file in public/uploads.
 */
export async function POST(request: Request) {
  if ((request.headers.get('content-type') ?? '').includes('multipart/form-data')) {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (blobUploadsEnabled()) return NextResponse.json({ error: 'Use direct Blob uploads' }, { status: 400 });
    try {
      const form = await request.formData();
      const file = form.get('file');
      if (!(file instanceof File)) return NextResponse.json({ error: 'No file' }, { status: 400 });
      const url = await saveLocalUpload(file, String(form.get('folder') ?? 'misc'));
      return NextResponse.json({ url });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed' }, { status: 400 });
    }
  }

  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      // Called for the token request from the admin's browser; Blob's completion
      // webhook (no session) never reaches this callback.
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error('Unauthorized');
        return {
          allowedContentTypes: [...UPLOAD_TYPES.keys()],
          maximumSizeInBytes: MAX_VIDEO_BYTES,
          addRandomSuffix: true
        };
      }
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed' }, { status: 400 });
  }
}
