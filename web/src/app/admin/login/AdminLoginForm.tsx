'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { authClient } from '@/lib/auth-client';

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    const { data, error: failure } = await authClient.signIn.email({
      email: String(form.get('email')),
      password: String(form.get('password'))
    });
    setBusy(false);
    if (failure) {
      setError(failure.status === 429 ? 'Too many attempts. Wait a minute and try again.' : 'Incorrect email or password.');
      return;
    }
    // The dashboard re-checks the role on the server; this only avoids a pointless redirect loop
    if ((data?.user as { role?: string } | undefined)?.role !== 'admin') {
      await authClient.signOut();
      setError('This account does not have admin access.');
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="admin-form">
      <label>
        Email
        <input type="email" name="email" autoComplete="username" required />
      </label>
      <label>
        Password
        <input type="password" name="password" autoComplete="current-password" required />
      </label>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
