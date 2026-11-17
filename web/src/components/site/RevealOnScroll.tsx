'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** React tags DOM nodes it has hydrated with an internal `__reactFiber$…` key. */
const isHydrated = (el: Element) => Object.keys(el).some(key => key.startsWith('__reactFiber$'));

/**
 * Marks .reveal elements with [data-revealed] as they scroll into view (the original
 * scroll animation). Streamed sections hydrate after this component, and touching their
 * DOM earlier causes a hydration mismatch, so each element waits until React owns it.
 * A data attribute (not a class) is used so later re-renders never reset it.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const reveal = (el: Element) => {
      if (isHydrated(el)) {
        el.setAttribute('data-revealed', '');
        return;
      }
      const timer = setTimeout(() => {
        timers.delete(timer);
        reveal(el);
      }, 100);
      timers.add(timer);
    };
    const pending = () => document.querySelectorAll<HTMLElement>('.reveal:not([data-revealed])');

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pending().forEach(reveal);
      return () => timers.forEach(clearTimeout);
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            reveal(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );
    const observeAll = () => pending().forEach(el => observer.observe(el));
    observeAll();
    // Content that streams in later (Suspense) is picked up too
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
