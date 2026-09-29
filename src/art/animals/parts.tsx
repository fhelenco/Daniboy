import type { ReactNode } from 'react';
import { LITE } from '../../lite';
import { Shadow } from '../Clay';

// Peças comuns dos bichinhos. Todos usam viewBox 300×300, com o chão em y≈286,
// e olham para a esquerda (onde o Daniboy chega).

export const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 300 300" className="h-full w-full" overflow="visible" style={{ filter: LITE ? undefined : 'url(#fuzz)' }} aria-hidden>
    {children}
  </svg>
);

export const Ground = ({ rx = 100 }: { rx?: number }) => <Shadow cx={150} cy={286} rx={rx} ry={14} />;

/** Olho de pelúcia: bem grande, escuro e brilhante, com dois reflexos (um grande em cima e um pequeno embaixo). */
export const Eye = ({ x, y, r = 10, look = -2 }: { x: number; y: number; r?: number; look?: number }) => {
  const rx = r * 1.15;
  const ry = r * 1.32;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#2b1e26" />
      <ellipse cx={x} cy={y + ry * 0.35} rx={rx * 0.78} ry={ry * 0.5} fill="#5b4351" opacity={0.75} />
      <ellipse cx={x + look * 0.4} cy={y - ry * 0.32} rx={rx * 0.44} ry={ry * 0.4} fill="#fff" />
      <circle cx={x + look * 0.4 + rx * 0.5} cy={y + ry * 0.42} r={rx * 0.2} fill="#fff" opacity={0.9} />
    </g>
  );
};

export const Cheek = ({ x, y, r = 9 }: { x: number; y: number; r?: number }) => (
  <ellipse cx={x} cy={y} rx={r * 1.15} ry={r * 0.75} fill="#ff7f9a" opacity={0.55} />
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
  <g>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.8} fill="#2a1f28" />
    <ellipse cx={x - r * 0.3} cy={y - r * 0.3} rx={r * 0.35} ry={r * 0.22} fill="#fff" opacity={0.75} />
  </g>
);
