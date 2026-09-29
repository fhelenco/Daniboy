import { useId, type CSSProperties, type ReactNode } from 'react';
import { C, Line, Shadow } from '../art/Clay';
import { blob, leafPath, rng, rrect } from '../art/geom';
import { PALETTE } from '../art/palette';

// Peças de interface em massinha: placas de madeira, molduras de card, livro aberto e barra de progresso.
// Cada uma é um SVG com o conteúdo (botões, ícones, bichos) por cima.

type Box = { w: number; h: number };

/** Linhas onduladas de veio da madeira (sempre iguais para o mesmo `seed`). */
function grain(w: number, h: number, seed: number, n: number) {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const y = ((i + 0.6 + r() * 0.5) / n) * h;
    const x0 = 14 + r() * 30;
    const x1 = w - 14 - r() * 30;
    const a = (r() - 0.5) * 8;
    return `M${x0.toFixed(0)} ${y.toFixed(0)}Q${(w * 0.35).toFixed(0)} ${(y + a).toFixed(0)} ${(w * 0.6).toFixed(0)} ${(y - a).toFixed(0)}T${x1.toFixed(0)} ${y.toFixed(0)}`;
  }).join('');
}

/** Ramo com três folhinhas: enfeite de canto. Base em (0,0), aponta para cima. */
export function Sprig({ x, y, rot = 0, s = 1, flip = false }: { x: number; y: number; rot?: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`}>
      <Line d="M0 0Q4 -26 0 -44" color="rgb(50 100 40 / 0.6)" w={5} />
      <C d={leafPath(58, 24)} c="leafBright" t="rotate(-52) translate(0 -6)" />
      <C d={leafPath(66, 26)} c="leafBright" t="rotate(4) translate(0 -20)" />
      <C d={leafPath(54, 22)} c="leaf" t="rotate(56) translate(0 -8)" />
    </g>
  );
}

/** Florzinha branca com miolo amarelo. */
export function Daisy({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <C key={a} d="M0 0C9 -4 10 -22 0 -26C-10 -22 -9 -4 0 0Z" c="petal" t={`rotate(${a}) translate(0 -3)`} grain={false} />
      ))}
      <C d="M-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0Z" c="pollen" grain={false} />
    </g>
  );
}

/** Joaninha. */
export function Ladybug({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <C d="M-15 0a15 13 0 1 1 30 0a15 15 0 0 1 -30 0Z" c="coral" grain={false} />
      <path d="M0 -13V14" stroke="#2b2233" strokeWidth={2.4} />
      {[[-7, -3], [7, -3], [-6, 6], [6, 6]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={2.6} fill="#2b2233" />
      ))}
      <C d="M-9 -12a9 8 0 0 1 18 0Z" c="dark" grain={false} />
    </g>
  );
}

/** Fundo de madeira: tábua com veios, brilho no topo e borda mais escura. */
function Plank({ w, h, r, seed, tone = 'plank' as 'plank' | 'frame' }: Box & { r: number; seed: number; tone?: 'plank' | 'frame' }) {
  const id = useId();
  const [a, b, d] = PALETTE[tone];
  return (
    <>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.5" stopColor={b} />
          <stop offset="1" stopColor={d} />
        </linearGradient>
        <clipPath id={`${id}-c`}>
          <path d={rrect(0, 0, w, h, r)} />
        </clipPath>
      </defs>
      <path d={rrect(0, 0, w, h, r)} fill={`url(#${id}-g)`} />
      <g clipPath={`url(#${id}-c)`}>
        <path d={rrect(0, 0, w, h, r)} fill="url(#grain)" />
        <path d={grain(w, h, seed, 5)} fill="none" stroke="rgb(70 35 10 / 0.22)" strokeWidth={4} strokeLinecap="round" />
        <path d={grain(w, h, seed + 9, 4)} fill="none" stroke="rgb(255 225 170 / 0.22)" strokeWidth={3} strokeLinecap="round" />
        {/* luz no alto e sombra embaixo, como massinha */}
        <ellipse cx={w * 0.4} cy={-h * 0.18} rx={w * 0.7} ry={h * 0.5} fill="rgb(255 240 200 / 0.28)" />
        <ellipse cx={w * 0.6} cy={h * 1.2} rx={w * 0.75} ry={h * 0.45} fill="rgb(60 25 5 / 0.22)" />
      </g>
      <path d={rrect(0, 0, w, h, r)} fill="none" stroke="rgb(85 45 15 / 0.55)" strokeWidth={5} />
    </>
  );
}

/**
 * Placa de madeira. `post`: altura de um poste embaixo (para ficar fincada no chão).
 * Os filhos ficam centralizados dentro da placa.
 */
export function WoodSign({
  w,
  h,
  r = 48,
  post = 0,
  seed = 3,
  leaves = true,
  className = '',
  style,
  children,
}: Box & { r?: number; post?: number; seed?: number; leaves?: boolean; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div className={`relative ${className}`} style={{ width: w, height: h + post, ...style }}>
      <svg width={w} height={h + post + 24} viewBox={`0 0 ${w} ${h + post + 24}`} className="absolute left-0 top-0 overflow-visible" aria-hidden>
        <Shadow cx={w / 2} cy={h + post + 10} rx={w * 0.42} ry={14} />
        {post > 0 && (
          <g transform={`translate(${w / 2 - 34} ${h - 40})`}>
            <Plank w={68} h={post + 40} r={16} seed={seed + 4} tone="frame" />
          </g>
        )}
        <Plank w={w} h={h} r={r} seed={seed} />
        <circle cx={r * 0.55} cy={h / 2} r={6} fill="rgb(90 50 20 / 0.5)" />
        <circle cx={w - r * 0.55} cy={h / 2} r={6} fill="rgb(90 50 20 / 0.5)" />
        {leaves && (
          <>
            <Sprig x={w - 30} y={20} rot={40} s={0.9} />
            <Sprig x={34} y={h - 14} rot={-150} s={0.85} />
            <Daisy x={w - 74} y={h - 10} s={0.9} />
          </>
        )}
      </svg>
      <div className="absolute left-0 top-0 flex items-center justify-center" style={{ width: w, height: h }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Moldura de card: madeira por fora, papel creme por dentro, pespontos e folhinhas nos cantos.
 * Os filhos ocupam a parte de dentro.
 */
export function FramedPanel({
  w,
  h,
  frame = 26,
  r = 54,
  leaves = true,
  seed = 5,
  className = '',
  style,
  children,
}: Box & { frame?: number; r?: number; leaves?: boolean; seed?: number; className?: string; style?: CSSProperties; children?: ReactNode }) {
  const id = useId();
  const [a, b, d] = PALETTE.paper;
  const ir = Math.max(12, r - frame * 0.6);
  return (
    <div className={`relative ${className}`} style={{ width: w, height: h, ...style }}>
      <svg width={w} height={h + 20} viewBox={`0 0 ${w} ${h + 20}`} className="absolute left-0 top-0 overflow-visible" aria-hidden>
        <defs>
          <radialGradient id={`${id}-p`} cx="0.35" cy="0.25" r="0.9">
            <stop offset="0" stopColor={a} />
            <stop offset="0.6" stopColor={b} />
            <stop offset="1" stopColor={d} />
          </radialGradient>
        </defs>
        <Shadow cx={w / 2} cy={h + 8} rx={w * 0.45} ry={14} />
        <Plank w={w} h={h} r={r} seed={seed} tone="frame" />
        <g transform={`translate(${frame} ${frame})`}>
          <path d={rrect(0, 0, w - frame * 2, h - frame * 2, ir)} fill={`url(#${id}-p)`} />
          <path d={rrect(0, 0, w - frame * 2, h - frame * 2, ir)} fill="url(#grain)" opacity={0.7} />
          {/* sombra de dentro do vão */}
          <path d={rrect(0, 0, w - frame * 2, h - frame * 2, ir)} fill="none" stroke="rgb(90 45 10 / 0.35)" strokeWidth={9} />
          <path d={rrect(14, 14, w - frame * 2 - 28, h - frame * 2 - 28, Math.max(8, ir - 12))} fill="none" stroke="rgb(190 150 95 / 0.6)" strokeWidth={3} strokeDasharray="10 9" strokeLinecap="round" />
        </g>
        {leaves && (
          <>
            <Sprig x={64} y={26} rot={-42} s={0.95} />
            <Sprig x={w - 26} y={h - 40} rot={150} s={0.9} />
          </>
        )}
      </svg>
      <div className="absolute" style={{ left: frame, top: frame, width: w - frame * 2, height: h - frame * 2 }}>
        {children}
      </div>
    </div>
  );
}

/** Livro aberto (álbum): capa marrom, duas páginas creme com pesponto e a dobra no meio. */
export function OpenBook({ w, h, className = '', style, children }: Box & { className?: string; style?: CSSProperties; children?: ReactNode }) {
  const id = useId();
  const [a, b, d] = PALETTE.paper;
  const pad = 30;
  const pw = (w - pad * 2) / 2;
  const ph = h - pad * 2;
  return (
    <div className={`relative ${className}`} style={{ width: w, height: h, ...style }}>
      <svg width={w} height={h + 20} viewBox={`0 0 ${w} ${h + 20}`} className="absolute left-0 top-0 overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={`${id}-l`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={a} />
            <stop offset="0.75" stopColor={b} />
            <stop offset="1" stopColor={d} />
          </linearGradient>
          <linearGradient id={`${id}-r`} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor={a} />
            <stop offset="0.75" stopColor={b} />
            <stop offset="1" stopColor={d} />
          </linearGradient>
        </defs>
        <Shadow cx={w / 2} cy={h + 10} rx={w * 0.46} ry={16} />
        <Plank w={w} h={h} r={50} seed={11} tone="frame" />
        <g transform={`translate(${pad} ${pad})`}>
          <path d={rrect(0, 0, pw + 10, ph, 30)} fill={`url(#${id}-l)`} />
          <path d={rrect(pw - 10, 0, pw + 10, ph, 30)} fill={`url(#${id}-r)`} />
          <path d={rrect(0, 0, pw * 2, ph, 30)} fill="url(#grain)" opacity={0.55} />
          <path d={rrect(16, 16, pw - 30, ph - 32, 20)} fill="none" stroke="rgb(190 150 95 / 0.55)" strokeWidth={3} strokeDasharray="10 9" strokeLinecap="round" />
          <path d={rrect(pw + 14, 16, pw - 30, ph - 32, 20)} fill="none" stroke="rgb(190 150 95 / 0.55)" strokeWidth={3} strokeDasharray="10 9" strokeLinecap="round" />
          <rect x={pw - 5} y={0} width={10} height={ph} fill="rgb(110 60 20 / 0.28)" />
        </g>
        <Sprig x={64} y={28} rot={-40} s={0.95} />
        <Sprig x={w - 34} y={h - 42} rot={150} s={0.9} />
        <Sprig x={w - 40} y={30} rot={30} s={0.8} flip />
      </svg>
      <div className="absolute" style={{ left: pad, top: pad, width: pw * 2, height: ph }}>
        {children}
      </div>
    </div>
  );
}

/** Barra de progresso de madeira com enchimento verde. `value` de 0 a 1. */
export function WoodBar({ w, h = 64, value }: { w: number; h?: number; value: number }) {
  const id = useId();
  const inner = h - 22;
  const fillW = Math.max(inner, (w - 22) * Math.min(1, Math.max(0, value)));
  const [a, b, d] = PALETTE.leafBright;
  return (
    <svg width={w} height={h + 14} viewBox={`0 0 ${w} ${h + 14}`} className="overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`${id}-f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.5" stopColor={b} />
          <stop offset="1" stopColor={d} />
        </linearGradient>
      </defs>
      <Shadow cx={w / 2} cy={h + 6} rx={w * 0.45} ry={9} />
      <Plank w={w} h={h} r={h / 2} seed={21} tone="frame" />
      <path d={rrect(11, 11, w - 22, inner, inner / 2)} fill="rgb(70 35 10 / 0.55)" />
      <path d={rrect(11, 11, fillW, inner, inner / 2)} fill={`url(#${id}-f)`} style={{ transition: 'all 0.4s ease-out' }} />
      <path d={rrect(11, 11, fillW, inner, inner / 2)} fill="url(#grain)" opacity={0.6} style={{ transition: 'all 0.4s ease-out' }} />
      <ellipse cx={11 + fillW * 0.35} cy={11 + inner * 0.28} rx={Math.max(4, fillW * 0.2)} ry={inner * 0.13} fill="rgb(255 255 255 / 0.45)" style={{ transition: 'all 0.4s ease-out' }} />
    </svg>
  );
}

/** Montinho de chão com tufos, onde o bicho fica em pé. `tone` muda com o lugar (grama, areia, areia molhada). */
export function Mound({ w, h, tone = 'moss', tuft = 'leaf', seed = 2, className = '', style }: Box & { tone?: 'moss' | 'sand' | 'wetSand'; tuft?: 'leaf' | 'dryGrass' | 'agave'; seed?: number; className?: string; style?: CSSProperties }) {
  const r = rng(seed);
  const tufts = Array.from({ length: 9 }, (_, i) => ({
    x: w * (0.1 + (i / 8) * 0.8) + (r() - 0.5) * 20,
    y: h * (0.3 + 0.16 * Math.sin((i / 8) * Math.PI) * -1 + 0.12 * r()),
    rot: (r() - 0.5) * 50,
    s: 0.55 + r() * 0.4,
    flip: r() > 0.5,
  }));
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={`overflow-visible ${className}`} style={style} aria-hidden>
      <C d={blob(w / 2, h * 0.62, w * 0.49, h * 0.36, seed, 0.03)} c={tone} />
      {tufts.map((t, i) => (
        <g key={i} transform={`translate(${t.x} ${t.y}) rotate(${t.rot}) scale(${t.flip ? -t.s : t.s} ${t.s})`}>
          <C d={leafPath(36, 12)} c={tuft} t="rotate(-24)" grain={false} />
          <C d={leafPath(44, 13)} c={tuft} t="rotate(6)" grain={false} />
          <C d={leafPath(34, 11)} c={tuft} t="rotate(34)" grain={false} />
        </g>
      ))}
    </svg>
  );
}
