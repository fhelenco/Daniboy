import { band, C, Line, S, Shadow, Sheen } from './Clay';
import { blob, ell, rng, rrect } from './geom';
import type { ClayColor } from './palette';
import { at, Foam, Pine, Rock, type P } from './props';

export function Shell({ x, y, s = 1, c = 'shell' }: P & { c?: ClayColor }) {
  return (
    <g transform={at(x, y, s)}>
      <Shadow cx={0} cy={0} rx={32} ry={6} />
      <C d={rrect(-9, -8, 18, 9, 3)} c={c} />
      <C d="M0 -4L-27 -26Q-31 -44 -14 -51Q0 -57 14 -51Q31 -44 27 -26Z" c={c} />
      <Line d="M0 -6L-24 -38M0 -6L-13 -49M0 -6L0 -54M0 -6L13 -49M0 -6L24 -38" color="rgb(200 90 70 / 0.4)" w={2.5} />
    </g>
  );
}

export function Conch({ x, y, s = 1 }: P) {
  return (
    <g transform={at(x, y, s)}>
      <Shadow cx={0} cy={0} rx={36} ry={6} />
      <C d="M-30 -2C-34 -22 -8 -38 20 -32C34 -29 36 -14 26 -8L-30 -2Z" c="shell" />
      <Line d="M-18 -6Q-10 -24 4 -32M-4 -6Q4 -22 16 -30M10 -6Q18 -16 26 -22" color="rgb(190 110 80 / 0.45)" />
      <Sheen cx={-6} cy={-22} rx={10} ry={5} />
    </g>
  );
}

export function Coral({ x, y, s = 1 }: P) {
  return (
    <g transform={at(x, y, s)}>
      <S d="M0 0V-48M0 -22Q-20 -28 -22 -52M0 -30Q20 -36 24 -60M-12 -40Q-26 -42 -30 -34M12 -44Q22 -50 20 -64" c="coral" w={11} />
    </g>
  );
}

/** Ilhota de pedra com topo verde e pinheirinhos. */
export function Islet({ x, y, s = 1, seed = 1, pines = 2 }: P & { pines?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <C d={blob(0, -30, 130, 50, seed, 0.12)} c="rock" />
      <Line d="M-80 -30Q-60 -50 -40 -40M20 -60Q40 -40 70 -44" color="rgb(70 70 70 / 0.18)" w={4} />
      <C d={blob(-10, -70, 96, 30, seed + 1, 0.15)} c="leafDark" />
      <C d={ell(-50, -84, 30, 22)} c="leaf" />
      <C d={ell(20, -92, 34, 24)} c="leaf" />
      {Array.from({ length: pines }, (_, i) => (
        <Pine key={i} x={-30 + i * 50} y={-86} s={0.28 + (i % 2) * 0.08} grain={false} />
      ))}
      <Foam x={-120} y={6} w={240} seed={seed} />
    </g>
  );
}

/** Penhasco com gramado e farol listrado. */
export function Lighthouse({ x, y, s = 1 }: P) {
  return (
    <g transform={at(x, y, s)}>
      <C d={blob(0, -80, 170, 90, 5, 0.1)} c="rock" />
      <C d={blob(-10, -150, 150, 34, 6, 0.15)} c="moss" />
      <Pine x={-120} y={-150} s={0.4} />
      <Pine x={120} y={-148} s={0.34} />
      <C d="M-30 -160L-22 -330H22L30 -160Z" c="petal" />
      <path d="M-27 -220L-25 -256H25L27 -220Z" fill={band('boat')} />
      <C d={rrect(-30, -350, 60, 24, 6)} c="dark" />
      <C d={rrect(-20, -380, 40, 32, 8)} c="sun" />
      <C d="M-28 -380Q0 -414 28 -380Z" c="boat" />
      <C d={rrect(-6, -200, 12, 18, 5)} c="dark" />
      <Foam x={-170} y={4} w={340} seed={8} />
    </g>
  );
}

/** Penhasco alto com pinheiros no topo (começo da praia). */
export function Cliff({ x, y, s = 1, flip = false }: P & { flip?: boolean }) {
  return (
    <g transform={at(x, y, s, flip)}>
      <C d="M-260 0C-250 -120 -240 -260 -200 -330C-150 -380 40 -390 110 -350C160 -300 190 -150 220 0Z" c="rock" />
      <Line d="M-180 -300C-170 -200 -190 -100 -170 0M-60 -360C-50 -240 -70 -120 -50 0M60 -350C70 -250 50 -130 80 0" color="rgb(70 70 70 / 0.16)" w={6} />
      <C d={blob(-60, -350, 190, 34, 3, 0.15)} c="moss" />
      {[-190, -120, -40, 50].map((px, i) => (
        <Pine key={px} x={px} y={-352} s={0.5 + (i % 2) * 0.15} />
      ))}
      <Sheen cx={-120} cy={-250} rx={60} ry={30} o={0.35} />
    </g>
  );
}

/** Suculentas gordinhas (como as da areia na referência). */
export function IcePlant({ x, y, s = 1, seed = 1 }: P) {
  const r = rng(seed);
  return (
    <g transform={at(x, y, s)}>
      {Array.from({ length: 9 }, (_, i) => {
        const a = -80 + i * 20 + (r() - 0.5) * 10;
        const l = 34 + r() * 22;
        return <C key={i} d={rrect(-6, -l, 12, l, 6)} c={i % 3 ? 'fern' : 'leaf'} t={`rotate(${a.toFixed(0)})`} grain={false} />;
      })}
    </g>
  );
}

/** Pedra com cracas (bolinhas claras). */
export function BarnacleRock({ x, y, s = 1, seed = 1, flip = false }: P & { flip?: boolean }) {
  const r = rng(seed);
  return (
    <g transform={at(x, y, s, flip)}>
      <Rock x={0} y={0} seed={seed} />
      {Array.from({ length: 7 }, (_, i) => {
        const bx = -40 + r() * 70;
        const by = -60 + r() * 40;
        return (
          <g key={i}>
            <C d={ell(bx, by, 7, 6)} c="drift" grain={false} />
            <circle cx={bx} cy={by} r={2.4} fill="#6b6258" />
          </g>
        );
      })}
    </g>
  );
}

/** Piscina natural entre pedras, com coral. */
export function TidePool({ x, y, s = 1 }: P) {
  return (
    <g transform={at(x, y, s)}>
      <C d={ell(0, 0, 150, 26)} c="wetSand" />
      <path d={ell(0, -2, 124, 18)} fill={band('turq')} />
      <Line d="M-70 -4Q0 -10 70 -4" color="rgb(255 255 255 / 0.55)" w={3} />
      <Rock x={-130} y={10} s={0.5} seed={41} />
      <Rock x={120} y={8} s={0.42} seed={42} flip />
      <Coral x={-20} y={4} s={0.8} />
      <C d={blob(40, 0, 16, 9, 3)} c="bloom" />
    </g>
  );
}

/** Cerca de postes de madeira com corda. */
export function RopeFence({ x, y, posts = 3, gap = 110 }: { x: number; y: number; posts?: number; gap?: number }) {
  const xs = Array.from({ length: posts }, (_, i) => x + i * gap);
  const rope = xs.slice(1).map((px, i) => `M${xs[i]} ${y - 70}Q${(xs[i] + px) / 2} ${y - 40} ${px} ${y - 70}`).join('');
  return (
    <g>
      {xs.map((px) => (
        <g key={px}>
          <Shadow cx={px} cy={y + 2} rx={26} ry={6} />
          <C d={rrect(px - 11, y - 96, 22, 98, 8)} c="drift" />
          <Line d={`M${px - 4} ${y - 90}V${y - 10}`} color="rgb(110 90 60 / 0.3)" />
        </g>
      ))}
      <path d={rope} stroke="url(#c-rope)" strokeWidth={7} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Pegadinhas na areia. */
export function Footprints({ x, y, n = 5 }: { x: number; y: number; n?: number }) {
  return (
    <g opacity={0.35}>
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx={x + i * 46} cy={y + (i % 2) * 16} rx={9} ry={5} fill="#b98a52" />
      ))}
    </g>
  );
}
