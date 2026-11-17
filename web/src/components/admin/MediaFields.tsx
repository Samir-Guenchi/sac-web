'use client';

import { upload } from '@vercel/blob/client';
import { useEffect, useRef, useState } from 'react';

type Kind = 'image' | 'video';
const ACCEPT: Record<Kind, string> = {
  image: 'image/jpeg,image/png,image/webp,image/avif',
  video: 'video/mp4,video/webm'
};

let modePromise: Promise<'blob' | 'local'> | null = null;
function uploadMode() {
  modePromise ??= fetch('/api/admin/upload')
    .then(r => r.json())
    .then((r: { mode?: 'blob' | 'local' }) => r.mode ?? 'local');
  return modePromise;
}

/** Uploads one file (Vercel Blob in production, public/uploads locally) and returns its URL. */
async function uploadFile(file: File, folder: string): Promise<string> {
  if ((await uploadMode()) === 'blob') {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const blob = await upload(`${folder}/${Date.now()}.${ext}`, file, { access: 'public', handleUploadUrl: '/api/admin/upload' });
    return blob.url;
  }
  const body = new FormData();
  body.set('file', file);
  body.set('folder', folder);
  const response = await fetch('/api/admin/upload', { method: 'POST', body });
  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) throw new Error(result.error ?? 'Upload failed');
  return result.url;
}

function useUploader(folder: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (file: File, done: (url: string) => void) => {
    setBusy(true);
    setError(null);
    try {
      done(await uploadFile(file, folder));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, run };
}

function Preview({ url, kind }: { url: string; kind: Kind }) {
  if (!url) return <div className="admin-media-empty">—</div>;
  return kind === 'video' ? <video src={url} className="admin-media-preview" muted controls preload="metadata" /> : <img src={url} alt="" className="admin-media-preview" />;
}

/** Single image or video: preview, URL field, upload button. Submits `name` as a URL. */
export function MediaField({ name, label, defaultValue, kind = 'image', folder, hint }: { name: string; label: string; defaultValue?: string | null; kind?: Kind; folder: string; hint?: string }) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const { busy, error, run } = useUploader(folder);
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="admin-field admin-media">
      <span>{label}</span>
      <Preview url={url} kind={kind} />
      <div className="admin-media-row">
        <input name={name} value={url} onChange={event => setUrl(event.target.value)} placeholder="https://… or /assets/…" />
        <button type="button" className="admin-btn" disabled={busy} onClick={() => input.current?.click()}>
          {busy ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={input}
          type="file"
          accept={ACCEPT[kind]}
          hidden
          onChange={event => {
            const file = event.target.files?.[0];
            if (file) void run(file, setUrl);
            event.target.value = '';
          }}
        />
      </div>
      {hint && <small className="admin-muted">{hint}</small>}
      {error && <small className="admin-error">{error}</small>}
    </div>
  );
}

/** Ordered photo list: the first photo is the main one. Submits `name` as newline-separated URLs. */
export function GalleryField({ name, label, defaultValue, folder }: { name: string; label: string; defaultValue: string[]; folder: string }) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [manual, setManual] = useState('');
  const { busy, error, run } = useUploader(folder);
  const input = useRef<HTMLInputElement>(null);
  const [queue, setQueue] = useState<File[]>([]);

  // Upload several files one after another
  useEffect(() => {
    if (busy || queue.length === 0) return;
    const [next, ...rest] = queue;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- advancing the upload queue
    setQueue(rest);
    void run(next, url => setUrls(current => [...current, url]));
  }, [queue, busy, run]);

  const move = (from: number, to: number) =>
    setUrls(current => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });

  return (
    <div className="admin-field">
      <span>{label}</span>
      <input type="hidden" name={name} value={urls.join('\n')} />
      <div className="admin-gallery">
        {urls.map((url, index) => (
          <figure key={`${url}-${index}`} className={index === 0 ? 'is-primary' : ''}>
            <img src={url} alt="" />
            <figcaption>
              {index === 0 ? <strong>Main photo</strong> : <button type="button" onClick={() => move(index, 0)}>Make main</button>}
              <span>
                <button type="button" aria-label="Move left" onClick={() => move(index, index - 1)}>
                  ←
                </button>
                <button type="button" aria-label="Move right" onClick={() => move(index, index + 1)}>
                  →
                </button>
                <button type="button" aria-label="Remove photo" onClick={() => setUrls(current => current.filter((_, i) => i !== index))}>
                  ✕
                </button>
              </span>
            </figcaption>
          </figure>
        ))}
        <button type="button" className="admin-gallery-add" disabled={busy} onClick={() => input.current?.click()}>
          {busy || queue.length ? 'Uploading…' : '+ Add photos'}
        </button>
      </div>
      <input
        ref={input}
        type="file"
        accept={ACCEPT.image}
        multiple
        hidden
        onChange={event => {
          setQueue(current => [...current, ...Array.from(event.target.files ?? [])]);
          event.target.value = '';
        }}
      />
      <div className="admin-media-row">
        <input value={manual} onChange={event => setManual(event.target.value)} placeholder="…or paste an image URL" />
        <button
          type="button"
          className="admin-btn"
          onClick={() => {
            if (manual.trim()) setUrls(current => [...current, manual.trim()]);
            setManual('');
          }}
        >
          Add URL
        </button>
      </div>
      {error && <small className="admin-error">{error}</small>}
    </div>
  );
}
