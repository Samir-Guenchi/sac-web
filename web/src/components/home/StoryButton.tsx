'use client';

import type { ReactNode } from 'react';
import { useStore } from '@/components/store/StoreProvider';

export function StoryButton({ className, children }: { className: string; children: ReactNode }) {
  const { ui } = useStore();
  return (
    <button type="button" className={className} onClick={() => ui.setStoryOpen(true)}>
      {children}
    </button>
  );
}
