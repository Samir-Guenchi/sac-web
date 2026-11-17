'use client';

import { useStore } from '@/components/store/StoreProvider';

export function Toasts() {
  const { t, ui } = useStore();
  return (
    <div className="toast-container" aria-live="polite">
      {ui.toasts.map(toast => (
        <div className="toast" role="status" key={toast.id}>
          <div className="toast-content">
            <div className="toast-title">{toast.title}</div>
            <div className="toast-desc">{toast.message}</div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            style={{ width: 24, height: 24, position: 'static', background: 'transparent', border: 'none', color: '#EDE6D6' }}
            aria-label={t('quickview.close')}
            onClick={() => ui.dismissToast(toast.id)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
