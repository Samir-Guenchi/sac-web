import type { ReactNode } from 'react';

/**
 * Picasso-style single-line drawings: the house's graphic signature.
 * Every stroke uses pathLength=1 so CSS can "draw" it when its .reveal parent
 * scrolls into view (see .line-art in brand.css). Decorative: hidden from screen readers.
 */
function Art({ viewBox, className = '', children }: { viewBox: string; className?: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} className={`line-art ${className}`} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

/** Woman's face in profile and front at once, after Picasso's portraits. */
export function PicassoFace({ className }: { className?: string }) {
  return (
    <Art viewBox="0 0 200 240" className={className}>
      <path pathLength={1} d="M60 70 C40 40 80 10 118 18 C160 12 186 46 172 84 C182 108 170 128 156 122" />
      <path pathLength={1} d="M60 70 C42 96 46 140 62 162 C70 192 92 214 120 216 C142 216 154 198 152 178" />
      <path pathLength={1} d="M74 62 C100 44 140 44 164 64" />
      <path pathLength={1} d="M80 104 C90 94 104 94 114 104 C104 112 90 112 80 104 Z" />
      <path pathLength={1} d="M130 98 C138 90 150 90 158 98 C150 106 138 106 130 98 Z" />
      <path pathLength={1} d="M120 108 C116 132 108 146 120 152 C126 155 130 151 132 148" />
      <path pathLength={1} d="M100 176 C110 168 120 172 124 176 C130 170 140 170 146 176 C136 188 112 188 100 176 Z" />
      <path pathLength={1} d="M152 178 C166 148 178 132 172 112" />
      <path pathLength={1} d="M120 216 C118 226 118 232 120 238" />
      <circle pathLength={1} cx="138" cy="212" r="8" />
      <circle cx="97" cy="104" r="3" fill="currentColor" stroke="none" className="line-art-dot" />
      <circle cx="144" cy="98" r="2.6" fill="currentColor" stroke="none" className="line-art-dot" />
    </Art>
  );
}

/** Three Mediterranean waves. */
export function Waves({ className }: { className?: string }) {
  return (
    <Art viewBox="0 0 120 80" className={className}>
      {[18, 36, 54].map(y => (
        <path key={y} pathLength={1} d={`M8 ${y} C20 ${y - 10} 32 ${y - 10} 44 ${y} S68 ${y + 10} 80 ${y} S104 ${y - 10} 112 ${y}`} />
      ))}
    </Art>
  );
}

/** An open eye: art in every detail. */
export function Eye({ className }: { className?: string }) {
  return (
    <Art viewBox="0 0 120 80" className={className}>
      <path pathLength={1} d="M10 40 C34 10 86 10 110 40 C86 70 34 70 10 40 Z" />
      <circle pathLength={1} cx="60" cy="40" r="15" />
      <circle cx="60" cy="40" r="5" fill="currentColor" stroke="none" className="line-art-dot" />
      <path pathLength={1} d="M30 18 L24 8 M48 12 L46 2 M72 12 L74 2 M90 18 L96 8" />
    </Art>
  );
}

/** Profile of a woman, drawn as one line: Picasso inspiration. */
export function Profile({ className }: { className?: string }) {
  return (
    <Art viewBox="0 0 100 120" className={className}>
      <path pathLength={1} d="M64 10 C40 6 26 24 30 44 C24 50 20 56 26 60 C24 66 28 70 32 70 C30 78 34 84 42 82 C46 92 44 102 36 112" />
      <path pathLength={1} d="M64 10 C86 14 94 40 82 60 C76 72 74 88 82 110" />
      <path pathLength={1} d="M44 40 C48 37 52 37 55 40" />
      <path pathLength={1} d="M58 22 C70 18 80 26 82 38" />
    </Art>
  );
}

/** Olive branch, the Mediterranean in one gesture. */
export function OliveBranch({ className }: { className?: string }) {
  const leaves = [
    [30, 70, -30],
    [46, 58, 30],
    [58, 48, -35],
    [74, 38, 25],
    [86, 28, -30],
    [100, 20, 20]
  ] as const;
  return (
    <Art viewBox="0 0 130 90" className={className}>
      <path pathLength={1} d="M10 84 C40 66 80 40 122 12" />
      {leaves.map(([x, y, r]) => (
        <path key={`${x}-${y}`} pathLength={1} d={`M${x} ${y} c6 -14 18 -18 26 -16 c-4 10 -14 18 -26 16 Z`} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <circle cx="64" cy="58" r="3.5" fill="currentColor" stroke="none" className="line-art-dot" />
      <circle cx="92" cy="40" r="3" fill="currentColor" stroke="none" className="line-art-dot" />
    </Art>
  );
}

/** Mediterranean sun. */
export function Sun({ className }: { className?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6);
  return (
    <Art viewBox="0 0 100 100" className={className}>
      <circle pathLength={1} cx="50" cy="50" r="18" />
      {rays.map(a => (
        <path
          key={a}
          pathLength={1}
          d={`M${(50 + Math.cos(a) * 26).toFixed(1)} ${(50 + Math.sin(a) * 26).toFixed(1)} L${(50 + Math.cos(a) * 38).toFixed(1)} ${(50 + Math.sin(a) * 38).toFixed(1)}`}
        />
      ))}
    </Art>
  );
}

/** Moorish arch, as in the windows of the Casbah. */
export function Arch({ className }: { className?: string }) {
  return (
    <Art viewBox="0 0 80 110" className={className}>
      <path pathLength={1} d="M8 106 V48 C8 22 26 6 40 4 C54 6 72 22 72 48 V106" />
      <path pathLength={1} d="M18 106 V50 C18 30 30 16 40 14 C50 16 62 30 62 50 V106" />
      <path pathLength={1} d="M4 106 H76" />
    </Art>
  );
}

/** Thin gold flourish used between headings and text. */
export function Flourish({ className }: { className?: string }) {
  return (
    <Art viewBox="0 0 160 16" className={`line-art-flourish ${className ?? ''}`}>
      <path pathLength={1} d="M4 8 H66" />
      <circle cx="80" cy="8" r="3" fill="currentColor" stroke="none" className="line-art-dot" />
      <path pathLength={1} d="M94 8 H156" />
    </Art>
  );
}
