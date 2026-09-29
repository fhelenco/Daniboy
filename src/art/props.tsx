import { C, Line, S, Shadow, Sheen } from './Clay';
import { blob, ell, leafPath, rng, rrect } from './geom';
import type { ClayColor } from './palette';

// Objetos de cenário em massinha. Cada um tem a base em (x, y) e cresce para cima.
export type P = { x: number; y: number; s?: number; seed?: number };
export const at = (x: number, y: number, s = 1, flip = false) =>
  `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})`;

export function Cloud({ x, y, s = 1, seed = 1, c = 'cloud' }: P & { c?: ClayColor }) {
  return (
    <g transform={at(x, y, s)}>
      <C d={ell(-70, 8, 60, 46)} c={c} />
      <C d={ell(70, 10, 56, 40)} c={c} />
      <C d={ell(0, -14, 80, 66)} c={c} />
      <C d={blob(0, 30, 150, 34, seed, 0.03)} c={c} />
    </g>
  );
}

export function Sun({ x, y, r = 80, rays = false, c = 'sun' }: { x: number; y: number; r?: number; rays?: boolean; c?: ClayColor }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r * 2.4} fill="url(#glow)" opacity={0.6} />
      {rays &&
        Array.from({ length: 8 }, (_, i) => (
          <C key={i} d={rrect(-10, -r - 66, 20, 44, 10)} c="sun" t={`rotate(${i * 45 + 22})`} />
        ))}
      <C d={ell(0, 0, r)} c={c} grain={false} />
      <Sheen cx={-r * 0.3} cy={-r * 0.35} rx={r * 0.35} ry={r * 0.25} o={0.7} />
    </g>
  );
}

/** Pedra (ou pedregulho) com um companheiro menor, rachaduras e, se quiser, musgo em tufos. */
export function Rock({ x, y, s = 1, seed = 1, c = 'rock', moss = false, flip = false }: P & { c?: ClayColor; moss?: boolean; flip?: boolean }) {
  const r = rng(seed);
  return (
    <g transform={at(x, y, s, flip)}>
      <Shadow cx={10} cy={2} rx={96} ry={15} />
      <C d={blob(58, -20, 34, 24, seed + 1, 0.12, 8)} c={c} />
      <C d={blob(0, -38, 66, 44, seed, 0.1, 9)} c={c} />
      <Line d={`M${-30 + r() * 10} -60Q-12 -44 -18 -20M${18 + r() * 8} -70Q30 -50 22 -34`} color="rgb(60 50 40 / 0.18)" w={3} />
      <Sheen cx={-24} cy={-58} rx={24} ry={11} o={0.55} />
      {moss && (
        <>
          <C d={blob(-8, -76, 44, 12, seed + 3, 0.25)} c="moss" />
          {[-34, -12, 10, 30].map((mx, i) => (
            <C key={i} d={ell(mx, -84 + (i % 2) * 4, 12, 9)} c="moss" />
          ))}
        </>
      )}
    </g>
  );
}

export function Pebble({ x, y, s = 1, seed = 1, c = 'rock' }: P & { c?: ClayColor }) {
  return <C d={blob(x, y, 11 * s, 7 * s, seed, 0.12, 7)} c={c} />;
}

export function Flower({ x, y, s = 1, petal = 'petal', center = 'pollen' }: P & { petal?: ClayColor; center?: ClayColor }) {
  return (
    <g transform={at(x, y, s)}>
      <path d="M0 0Q3 -14 0 -26" stroke="#4f9a3a" strokeWidth={4} fill="none" strokeLinecap="round" />
      <g transform="translate(0 -30)">
        {[0, 72, 144, 216, 288].map((a) => (
          <C key={a} d={ell(0, -9, 7, 10)} c={petal} t={`rotate(${a})`} />
        ))}
        <C d={ell(0, 0, 6)} c={center} />
      </g>
    </g>
  );
}

/** Touceira de folhas largas. */
export function Plant({ x, y, s = 1, seed = 1, c = 'leafDark', c2 = 'leaf' }: P & { c?: ClayColor; c2?: ClayColor }) {
  const r = rng(seed);
  const leaves = [-62, -34, -8, 16, 40, 66].map((a) => ({ a: a + (r() - 0.5) * 12, l: 60 + r() * 30 }));
  return (
    <g transform={at(x, y, s)}>
      {leaves.map(({ a, l }, i) => (
        <g key={i} transform={`rotate(${a.toFixed(0)})`}>
          <C d={leafPath(l, l * 0.34)} c={i % 2 ? c : c2} />
          <Line d={`M0 -6L0 ${-l * 0.85}`} color="rgb(20 60 20 / 0.3)" w={2.5} />
        </g>
      ))}
    </g>
  );
}

export function Grass({ x, y, s = 1, c = 'moss' }: P & { c?: ClayColor }) {
  const blades: [number, number, number][] = [[-18, -24, -18], [-10, -34, -8], [-2, -46, 0], [8, -38, 10], [16, -26, 18]];
  return (
    <g transform={at(x, y, s)}>
      {blades.map(([bx, h, lean], i) => (
        <C
          key={i}
          grain={false}
          d={`M${bx - 4} 0Q${bx + lean * 0.3} ${h * 0.5} ${bx + lean} ${h}Q${bx + lean * 0.5 + 3} ${h * 0.45} ${bx + 4} 0Z`}
          c={c}
        />
      ))}
    </g>
  );
}

/** Folha redonda com nervuras (como as das árvores da referência). */
export function RoundLeaf({ x, y, r, rot, tone }: { x: number; y: number; r: number; rot: number; tone: ClayColor }) {
  const v = `M0 ${r * 0.75}L0 ${-r * 0.7}M0 0L${r * 0.55} ${-r * 0.45}M0 0L${-r * 0.55} ${-r * 0.45}M0 ${r * 0.35}L${r * 0.6} ${-r * 0.05}M0 ${r * 0.35}L${-r * 0.6} ${-r * 0.05}`;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)})`}>
      <C d={blob(0, 0, r, r * 0.92, Math.round(r * 7), 0.05, 8)} c={tone} />
      <Line d={v} color="rgb(60 90 20 / 0.28)" w={Math.max(1.5, r * 0.06)} />
    </g>
  );
}

/** Cacho de folhas redondas ao redor de (cx, cy); as de baixo mais escuras, as de cima mais claras. */
export function LeafCluster({ cx, cy, rx, ry, n, size, seed, tones = ['leafDark', 'leaf', 'lime'] }: {
  cx: number; cy: number; rx: number; ry: number; n: number; size: number; seed: number; tones?: [ClayColor, ClayColor, ClayColor];
}) {
  const r = rng(seed);
  const leaves = Array.from({ length: n }, () => {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r());
    const y = cy + Math.sin(a) * ry * d;
    const tone = y > cy + ry * 0.25 ? tones[0] : y > cy - ry * 0.25 ? tones[1] : tones[2];
    return { x: cx + Math.cos(a) * rx * d, y, r: size * (0.8 + r() * 0.4), rot: (r() - 0.5) * 80, tone };
  }).sort((p, q) => q.y - p.y);
  return (
    <>
      <C d={blob(cx, cy, rx * 0.95, ry * 0.9, seed, 0.08)} c={tones[0]} />
      {leaves.map((l, i) => (
        <RoundLeaf key={i} {...l} />
      ))}
    </>
  );
}

/** Árvore de "brócolis": copa de bolinhas de massinha. */
export function PuffTree({ x, y, s = 1, seed = 1, tones = ['leafDark', 'leaf', 'leafLight'] }: P & { tones?: [ClayColor, ClayColor, ClayColor] }) {
  const r = rng(seed);
  const puffs = Array.from({ length: 12 }, () => {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r());
    return { px: Math.cos(a) * 70 * d, py: -190 + Math.sin(a) * 52 * d, pr: 30 + r() * 18 };
  }).sort((p, q) => q.py - p.py);
  return (
    <g transform={at(x, y, s)}>
      <Shadow cx={0} cy={2} rx={80} ry={12} />
      <C d="M-16 2C-12 -40 -10 -100 -9 -160L9 -160C10 -100 12 -40 16 2Z" c="trunk" />
      <S d="M0 -120Q-30 -150 -44 -180" c="trunk" w={10} />
      <S d="M0 -130Q28 -160 40 -186" c="trunk" w={10} />
      <C d={blob(0, -186, 88, 66, seed, 0.08)} c={tones[0]} />
      {puffs.map((p, i) => (
        <C key={i} d={ell(p.px, p.py, p.pr)} c={p.py < -205 ? tones[2] : p.py < -180 ? tones[1] : tones[0]} />
      ))}
    </g>
  );
}

/** Pinheiro de "telhinhas" (camadas de folhas apontando para baixo, como na referência). */
export function Pine({ x, y, s = 1, c = 'pine', grain = true }: P & { c?: ClayColor; grain?: boolean }) {
  const tiers = [0, 1, 2, 3, 4];
  return (
    <g transform={at(x, y, s)}>
      <C d={rrect(-10, -44, 20, 48, 6)} c="trunk" grain={grain} />
      {tiers.map((i) => {
        const w = 82 - i * 15;
        const yb = -34 - i * 50;
        const n = Math.max(2, 5 - Math.floor(i / 2));
        return (
          <g key={i}>
            <C d={`M${-w * 0.8} ${yb}Q0 ${yb + 10} ${w * 0.8} ${yb}L0 ${yb - 96}Z`} c={c} grain={grain} />
            {Array.from({ length: n }, (_, k) => {
              const t = n === 1 ? 0.5 : k / (n - 1);
              const lx = (t - 0.5) * w * 1.5;
              return <C key={k} d={leafPath(58 - i * 6, 26 - i * 2)} c={c} t={`translate(${lx.toFixed(1)} ${yb - 52}) rotate(${(180 - (t - 0.5) * 50).toFixed(0)})`} grain={grain} />;
            })}
          </g>
        );
      })}
      <C d={leafPath(40, 16)} c={c} t={`translate(0 -280) rotate(0)`} grain={grain} />
    </g>
  );
}

export function Log({ x, y, s = 1, c = 'trunk', end = 'wood' }: P & { c?: ClayColor; end?: ClayColor }) {
  return (
    <g transform={at(x, y, s)}>
      <Shadow cx={0} cy={2} rx={140} ry={14} />
      <C d={rrect(-120, -58, 230, 58, 28)} c={c} />
      <C d={ell(110, -29, 22, 29)} c={end} />
      <Line d={ell(110, -29, 11, 16)} color="rgb(90 50 20 / 0.4)" />
      <Line d="M-100 -40H60M-90 -20H80M-60 -48Q-20 -44 20 -50" color="rgb(70 40 15 / 0.25)" />
    </g>
  );
}

/** Placa de madeira apontando para a frente (o caminho do Daniboy). */
export function Signpost({ x, y, s = 1 }: P) {
  return (
    <g transform={at(x, y, s)}>
      <Shadow cx={0} cy={2} rx={40} ry={8} />
      <C d={rrect(-9, -150, 18, 152, 7)} c="wood" />
      <C d="M-62 -142H38L68 -120L38 -98H-62Q-70 -98 -70 -106V-134Q-70 -142 -62 -142Z" c="wood" />
      <Line d="M-56 -128H30M-56 -112H36" color="rgb(90 50 20 / 0.35)" />
    </g>
  );
}

/** Espuma de onda: fileira de bolinhas brancas. */
export function Foam({ x, y, w, seed = 1 }: { x: number; y: number; w: number; seed?: number }) {
  const n = Math.max(2, Math.round(w / 16));
  return (
    <g>
      <C d={blob(x + w / 2, y + 2, w / 2 + 6, 7, seed, 0.1, 8)} c="foam" grain={false} />
      {Array.from({ length: n }, (_, i) => (
        <C key={i} d={blob(x + (i / (n - 1)) * w, y - 2 - ((i * 5) % 4), 14 + ((i * 3) % 6), 9, seed + i, 0.2, 7)} c="foam" grain={false} />
      ))}
    </g>
  );
}

export function Palm({ x, y, s = 1, lean = 1 }: P & { lean?: number }) {
  const top: [number, number] = [lean * 70, -390];
  const fronds = [-175, -145, -115, -80, -45, -15, 15, 195];
  return (
    <g transform={at(x, y, s)}>
      <Shadow cx={0} cy={2} rx={70} ry={12} />
      {Array.from({ length: 17 }, (_, i) => {
        const t = i / 16;
        return <C key={i} d={ell(lean * 70 * t * t, -380 * t, 25 - t * 6, 17)} c="palm" />;
      })}
      {fronds.map((a, i) => (
        <g key={a} transform={`translate(${top[0]} ${top[1]}) rotate(${a + 90})`}>
          <C d={leafPath(i % 2 ? 150 : 175, 30)} c={i % 3 === 0 ? 'leafLight' : 'leaf'} />
          <Line d="M0 -8L0 -150" color="rgb(20 70 20 / 0.3)" />
        </g>
      ))}
      {[-16, 4, 22].map((dx, i) => (
        <C key={dx} d={ell(top[0] + dx, top[1] + 18 + (i % 2) * 6, 15)} c="trunk" />
      ))}
    </g>
  );
}
