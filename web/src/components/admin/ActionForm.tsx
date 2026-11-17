'use client';

import { useActionState, type ReactNode } from 'react';
import type { ActionState } from '@/app/admin/(dashboard)/actions';

/** Wraps an admin Server Action with pending state and a success/error message. */
export function ActionForm({
  action,
  submitLabel,
  children,
  className
}: {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  submitLabel: string;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={`admin-form ${className ?? ''}`}>
      {children}
      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary" disabled={pending}>
          {pending ? 'Saving…' : submitLabel}
        </button>
        {state && (
          <span className={state.ok ? 'admin-success' : 'admin-error'} role={state.ok ? 'status' : 'alert'}>
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
