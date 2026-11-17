'use client';

import { useEffect, type ReactNode } from 'react';

/** Backdrop + dialog wrapper with Escape-to-close and body scroll lock (old modal CSS classes). */
export function Modal({
  open,
  onClose,
  label,
  closeLabel,
  children
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  closeLabel: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`modal-backdrop${open ? ' is-active' : ''}`} onClick={onClose} />
      <div className={`modal-content-wrapper${open ? ' is-active' : ''}`} role="dialog" aria-modal="true" aria-label={label} aria-hidden={!open}>
        {open && (
          <>
            <button type="button" className="modal-close-btn" aria-label={closeLabel} onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {children}
          </>
        )}
      </div>
    </>
  );
}
