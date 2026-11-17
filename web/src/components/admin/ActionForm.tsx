'use client';

import { startTransition, useActionState, type FormEvent, type ReactNode } from 'react';
import type { ActionState } from '@/app/admin/(dashboard)/actions';

/**
 * Wraps an admin Server Action with pending state and a success/error message.
 *
 * Submits through onSubmit instead of <form action>: React resets <form action>
 * forms after every submission, which would wipe everything the admin typed
 * whenever the server rejects one field. Here the fields keep their values.
 */
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

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={onSubmit} className={`admin-form ${className ?? ''}`}>
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
