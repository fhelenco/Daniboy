import type { ReactNode } from 'react';
import { Shadow } from '../Clay';

// Peças comuns dos bichinhos. Todos usam viewBox 300×300, com o chão em y≈286,
// e olham para a esquerda (onde o Daniboy chega).

export const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 300 300" className="h-full w-full" overflow="visible" aria-hidden>
    {children}
  </svg>
);

export const Ground = ({ rx = 100 }: { rx?: number }) => <Shadow cx={150} cy={286} rx={rx} ry={14} />;

export const Eye = ({ x, y, r = 10, look = -2 }: { x: number; y: number; r?: number; look?: number }) => (
  <g>
    <ellipse cx={x} cy={y} rx={r} ry={r * 1.12} fill="#fff" />
    <circle cx={x + look} cy={y + 1} r={r * 0.66} fill="#2a1f28" />
    <circle cx={x + look - r * 0.25} cy={y - r * 0.3} r={r * 0.26} fill="#fff" />
  </g>
);

export const Cheek = ({ x, y, r = 9 }: { x: number; y: number; r?: number }) => (
  <ellipse cx={x} cy={y} rx={r} ry={r * 0.62} fill="#ff8fa3" opacity={0.5} />
);

export const Smile = ({ x, y, w = 14 }: { x: number; y: number; w?: number }) => (
  <path
    d={`M${x - w / 2} ${y}Q${x} ${y + w * 0.55} ${x + w / 2} ${y}`}
    stroke="#3a2630"
    strokeWidth={4}
    strokeLinecap="round"
    fill="none"
  />
);

export const Nose = ({ x, y, r = 5 }: { x: number; y: number; r?: number }) => (
  <ellipse cx={x} cy={y} rx={r} ry={r * 0.8} fill="#2a1f28" />
);
