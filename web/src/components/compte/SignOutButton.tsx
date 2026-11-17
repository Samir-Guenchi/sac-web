'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function SignOutButton({ label, className, redirectTo }: { label: string; className?: string; redirectTo?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={className ?? 'btn-send-code'}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await authClient.signOut();
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
