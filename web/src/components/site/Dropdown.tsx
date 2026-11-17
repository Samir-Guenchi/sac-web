'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type DropdownOption<T extends string> = { value: T; label: string; hint?: string };

/**
 * Small listbox replacing native <select> where it shows (header currency/language, sorting).
 * Keyboard: Enter/Space/↓ opens, ↑/↓ move, Home/End, Enter selects, Escape closes.
 */
export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
  className = '',
  align = 'start'
}: {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  label: string;
  className?: string;
  align?: 'start' | 'end';
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const current = options.find(o => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const show = () => {
    setActive(Math.max(0, options.findIndex(o => o.value === value)));
    setOpen(true);
  };
  const choose = (index: number) => {
    setOpen(false);
    button.current?.focus();
    if (options[index] && options[index].value !== value) onChange(options[index].value);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    const last = options.length - 1;
    const moves: Record<string, () => void> = {
      ArrowDown: () => setActive(i => Math.min(last, i + 1)),
      ArrowUp: () => setActive(i => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => choose(active),
      ' ': () => choose(active),
      Escape: () => {
        setOpen(false);
        button.current?.focus();
      },
      Tab: () => setOpen(false)
    };
    const move = moves[event.key];
    if (move) {
      if (event.key !== 'Tab') event.preventDefault();
      move();
    }
  };

  return (
    <div ref={root} className={`zd ${className}${open ? ' is-open' : ''}`} onKeyDown={onKeyDown}>
      <button
        ref={button}
        type="button"
        className="zd-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${current?.label ?? ''}`}
        onClick={() => (open ? setOpen(false) : show())}
      >
        <span className="zd-value">{current?.label}</span>
        <svg className="zd-chevron" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          aria-activedescendant={`${listId}-${active}`}
          tabIndex={-1}
          className={`zd-menu zd-align-${align}`}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              data-active={index === active || undefined}
              className="zd-option"
              onPointerEnter={() => setActive(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.hint && <span className="zd-hint">{option.hint}</span>}
              <svg className="zd-check" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 6.5 5 9l5-6" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
