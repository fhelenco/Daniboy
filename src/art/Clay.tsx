import type { ClayColor } from './palette';

/** Nome de cor da paleta, ou uma cor escrita direto (#hex, rgb(...), url(...)). */
type Color = ClayColor | `#${string}` | `rgb${string}` | `url${string}` | 'none';

const isRaw = (c: string) => c.startsWith('#') || c.startsWith('rgb') || c.startsWith('url') || c === 'none';

/** Cor de massinha com volume (gradiente radial global). */
export const clay = (c: Color) => (isRaw(c) ? c : `url(#c-${c})`);
/** Cor de massinha em faixa vertical (gradiente linear global). */
export const band = (c: ClayColor) => `url(#v-${c})`;

/** Forma de massinha: preenchimento com volume + grão por cima. */
export function C({ d, c, t, o, grain = true }: { d: string; c: Color; t?: string; o?: number; grain?: boolean }) {
  return (
    <g transform={t} opacity={o}>
      <path d={d} fill={clay(c)} />
      {grain && <path d={d} fill="url(#grain)" />}
    </g>
  );
}

/** "Rolinho" de massinha: um traço grosso de pontas redondas (braços de cacto, galhos...). */
export function S({ d, c, w, t }: { d: string; c: Color; w: number; t?: string }) {
  const common = { d, fill: 'none', strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <g transform={t}>
      <path {...common} stroke={clay(c)} />
      <path {...common} stroke="url(#grain)" />
    </g>
  );
}

/** Linha fina de detalhe (vincos, sulcos). */
export function Line({ d, color = 'rgb(60 30 10 / 0.3)', w = 3, t }: { d: string; color?: string; w?: number; t?: string }) {
  return <path d={d} transform={t} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
}

/** Sombra macia no chão. */
export const Shadow = ({ cx, cy, rx, ry, o = 1 }: { cx: number; cy: number; rx: number; ry: number; o?: number }) => (
  <ellipse data-ground cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#shadow)" opacity={o} />
);

/** Brilho suave (luz batendo na massinha). */
export const Sheen = ({ cx, cy, rx, ry, o = 1, t }: { cx: number; cy: number; rx: number; ry: number; o?: number; t?: string }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#sheen)" opacity={o} transform={t} />
);
