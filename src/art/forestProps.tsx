import { band, C, Line, S, Shadow, Sheen } from './Clay';
import { blob, ell, leafPath, openCurve, rng, rrect } from './geom';
import type { ClayColor } from './palette';
import { at, Foam, LeafCluster, Rock, type P } from './props';

// ——— plantas ———

function Frond({ len, rot, curl, c }: { len: number; rot: number; curl: number; c: ClayColor }) {
  const n = 8;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return [Math.sin(t * curl * Math.PI) * len * 0.3, -t * len] as [number, number];
  });
  return (
    <g transform={`rotate(${rot.toFixed(0)})`}>
      <path d={openCurve(pts)} stroke="#3c7a34" strokeWidth={4} fill="none" strokeLinecap="round" />
      {pts.slice(1, -1).map(([px, py], i) => {
        const l = len * 0.24 * (1 - ((i + 1) / n) * 0.65);
        return (
          <g key={i} transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}>
            <C d={leafPath(l, l * 0.4)} c={c} t="rotate(-64)" grain={false} />
            <C d={leafPath(l, l * 0.4)} c={c} t="rotate(64)" grain={false} />
          </g>
        );
      })}
    </g>
  );
}

/** Samambaia: folhas longas com folíolos em pares, pontas levemente curvadas. */
export function Fern({ x, y, s = 1, seed = 1 }: P) {
  const r = rng(seed);
  const fronds = [-72, -48, -24, 0, 22, 46, 70].map((a) => ({ a: a + (r() - 0.5) * 12, len: 90 + r() * 50, curl: 0.15 + r() * 0.3 }));
  return (
    <g transform={at(x, y, s)}>
      {fronds.map((f, i) => (
        <Frond key={i} len={f.len} rot={f.a} curl={f.curl} c={i % 2 ? 'fern' : 'leaf'} />
      ))}
    </g>
  );
}

/** Trevinhos de três folhas redondas. */
export function Clover({ x, y, s = 1, seed = 1 }: P) {
  const r = rng(seed);
  return (
    <g transform={at(x, y, s)}>
      {[-22, 0, 22].map((dx, i) => {
        const h = 18 + r() * 14;
        return (
          <g key={i} transform={`translate(${dx} ${-h})`}>
            <path d={`M0 0L0 ${h}`} stroke="#4f9a3a" strokeWidth={3} />
            {[-90, 30, 150].map((a) => (
              <C key={a} d={ell(0, -8, 8, 9)} c={i % 2 ? 'lime' : 'leaf'} t={`rotate(${a + 90})`} grain={false} />
            ))}
          </g>
        );
      })}
    </g>
  );
}

// ——— árvores ———

/** Árvore enorme de tronco retorcido, raízes e copa de folhas redondas (emoldura a cena). */
export function TwistedTree({ x, y, s = 1, seed = 1, flip = false }: P & { flip?: boolean }) {
  return (
    <g transform={at(x, y, s, flip)}>
      <Shadow cx={20} cy={10} rx={220} ry={30} />
      <S d="M20 -700Q140 -800 240 -880" c="trunk" w={56} />
      <S d="M-10 -640Q-120 -740 -210 -800" c="trunk" w={44} />
      <C
        d="M-170 30C-110 0 -70 -50 -84 -150C-96 -260 -24 -330 -44 -450C-62 -560 -118 -640 -66 -760C-44 -820 -34 -880 -22 -940L84 -940C74 -880 94 -820 72 -760C40 -660 112 -560 98 -450C82 -330 134 -260 112 -150C102 -50 134 0 200 30Z"
        c="trunk"
      />
      <path
        d="M40 -940C30 -880 50 -820 30 -760C0 -660 70 -560 56 -450C40 -330 92 -260 70 -150C60 -50 90 0 150 30L200 30C134 0 102 -50 112 -150C134 -260 82 -330 98 -450C112 -560 40 -660 72 -760C94 -820 74 -880 84 -940Z"
        fill="rgb(70 35 10 / 0.22)"
      />
      <C d={blob(-120, 6, 60, 24, seed + 1, 0.2)} c="trunk" />
      <C d={blob(150, 8, 54, 22, seed + 2, 0.2)} c="trunk" />
      <Line d="M-40 -20C-50 -150 -4 -300 -20 -450C-36 -580 -80 -660 -40 -780C-24 -840 -14 -890 -4 -930M24 -40C34 -170 64 -300 48 -450C34 -560 -10 -660 20 -770C34 -830 32 -880 40 -930M-100 0C-80 -60 -60 -120 -64 -190M110 0C90 -60 84 -130 90 -200" color="rgb(80 40 15 / 0.3)" w={6} />
      <C d={blob(-60, -380, 26, 44, seed + 3, 0.25)} c="moss" />
      <C d={blob(66, -220, 22, 30, seed + 4, 0.25)} c="moss" />
      <Sheen cx={-30} cy={-500} rx={24} ry={120} o={0.35} />
      <LeafCluster cx={240} cy={-900} rx={170} ry={110} n={26} size={40} seed={seed + 5} tones={['leaf', 'lime', 'lime']} />
      <LeafCluster cx={-200} cy={-830} rx={150} ry={100} n={22} size={38} seed={seed + 6} tones={['leaf', 'lime', 'lime']} />
      <LeafCluster cx={40} cy={-960} rx={190} ry={110} n={28} size={42} seed={seed + 7} tones={['leaf', 'lime', 'lime']} />
    </g>
  );
}

// ——— fundo ———

/** Cordilheira de picos de pedra recortados, com a face de sombra (azulada pela distância). */
export function RockSpires({ x, y, s = 1, seed = 1, c = 'spire', o = 0.9 }: P & { c?: ClayColor; o?: number }) {
  const r = rng(seed);
  const peaks = Array.from({ length: 4 }, (_, i) => ({
    px: (i - 1.5) * 95 + (r() - 0.5) * 40,
    h: 110 + r() * 150,
    w: 75 + r() * 45,
    lean: (r() - 0.5) * 36,
  })).sort((a, b) => b.h - a.h);
  return (
    <g transform={at(x, y, s)} opacity={o}>
      {peaks.map(({ px, h, w, lean }, i) => {
        const top = px + lean;
        const d = `M${px - w} 0L${px - w * 0.55} ${-h * 0.5}L${px - w * 0.3} ${-h * 0.62}L${top - 8} ${-h}L${top + 8} ${-h + 4}L${px + w * 0.3} ${-h * 0.66}L${px + w * 0.55} ${-h * 0.42}L${px + w} 0Z`;
        const shade = `M${top + 8} ${-h + 4}L${px + w * 0.3} ${-h * 0.66}L${px + w * 0.55} ${-h * 0.42}L${px + w} 0L${px + w * 0.1} 0Z`;
        return (
          <g key={i}>
            <C d={d} c={c} grain={false} />
            <path d={shade} fill="rgb(60 70 100 / 0.16)" />
          </g>
        );
      })}
    </g>
  );
}

/** Penhasco com cachoeira caindo num laguinho. */
export function Waterfall({ x, y, s = 1 }: P) {
  return (
    <g transform={at(x, y, s)}>
      <C d={blob(0, -140, 170, 150, 21, 0.1)} c="rock" />
      <C d={blob(-110, -250, 70, 30, 22, 0.2)} c="moss" />
      <C d={blob(90, -275, 80, 30, 23, 0.2)} c="moss" />
      <path d={rrect(-34, -272, 68, 250, 22)} fill={band('water')} />
      <Line d="M-18 -262V-40M0 -266V-30M18 -262V-40" color="rgb(255 255 255 / 0.65)" w={4} />
      <C d={ell(0, -14, 130, 24)} c="water" />
      <Foam x={-60} y={-24} w={120} seed={5} />
    </g>
  );
}

/** Cerquinha de troncos. */
export function WoodFence({ x, ys }: { x: number; ys: number[] }) {
  const pts = ys.map((y, i) => [x + i * 70, y] as const);
  const rail = (dy: number) => 'M' + pts.map(([px, py]) => `${px} ${py + dy}`).join('L');
  return (
    <g>
      <S d={rail(-44)} c="wood" w={10} />
      <S d={rail(-22)} c="wood" w={10} />
      {pts.map(([px, py]) => (
        <C key={px} d={rrect(px - 8, py - 62, 16, 64, 6)} c="wood" />
      ))}
    </g>
  );
}

// ——— ponte sobre o riacho (no chão da trilha) ———

/**
 * O riacho corta a trilha e o Daniboy atravessa por uma ponte de troncos.
 * De `x` até `x + w`; o tabuleiro fica na altura dos pés (y≈790).
 */
export function LogBridge({ x, w }: { x: number; w: number }) {
  const logs = Math.round((w + 40) / 30);
  return (
    <g transform={`translate(${x} 0)`}>
      {/* riacho vindo do fundo e passando por baixo */}
      <path d={`M10 690Q${w / 2} 680 ${w - 10} 690L${w + 30} 900L-30 900Z`} fill={band('water')} />
      <Line d={`M30 712Q${w / 2} 704 ${w - 30} 712M20 734Q${w / 2} 726 ${w - 20} 734`} color="rgb(255 255 255 / 0.5)" w={3} />
      <Rock x={-10} y={760} s={0.7} seed={31} moss />
      <Rock x={w + 10} y={762} s={0.75} seed={32} moss flip />
      {/* tabuleiro visto de cima e a fileira de pontas de tronco na frente */}
      <C d={rrect(-24, 758, w + 48, 56, 14)} c="wood" />
      <Line d={Array.from({ length: logs }, (_, i) => `M${-12 + i * 30} 762V810`).join('')} color="rgb(110 60 20 / 0.25)" w={3} />
      {Array.from({ length: logs }, (_, i) => (
        <g key={i}>
          <C d={ell(-10 + i * 30, 826, 16, 17)} c="wood" />
          <Line d={ell(-10 + i * 30, 826, 7, 8)} color="rgb(110 60 20 / 0.35)" w={2} />
        </g>
      ))}
      {/* água na frente, abaixo da ponte */}
      <path d={`M-40 846H${w + 40}V900H-40Z`} fill={band('water')} />
      <Foam x={-20} y={852} w={w + 40} seed={9} />
      {/* corrimão */}
      {[0, w / 2, w].map((px) => (
        <C key={px} d={rrect(px - 10, 688, 20, 84, 9)} c="trunk" />
      ))}
      <S d={`M-6 702L${w + 6} 702`} c="trunk" w={16} />
      <S d={`M-6 736L${w + 6} 736`} c="trunk" w={12} />
    </g>
  );
}
