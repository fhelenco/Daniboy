// Geometria para o visual de massinha: formas levemente tortas, como feitas à mão.

type Pt = readonly [number, number];

const f = (v: number) => Math.round(v * 10) / 10;

/** Números aleatórios com semente (o desenho sai sempre igual). */
export function rng(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ell = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${f(cx - rx)} ${f(cy)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`;

export function rrect(x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  return (
    `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}` +
    `Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`
  );
}

function segment(p0: Pt, p1: Pt, p2: Pt, p3: Pt) {
  const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
  const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
  return `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
}

/** Curva suave fechada passando pelos pontos. */
export function closedCurve(pts: Pt[]) {
  const n = pts.length;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    d += segment(pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]);
  }
  return d + 'Z';
}

/** Curva suave aberta passando pelos pontos. */
export function openCurve(pts: Pt[]) {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    d += segment(pts[Math.max(0, i - 1)], pts[i], pts[i + 1], pts[Math.min(pts.length - 1, i + 2)]);
  }
  return d;
}

/** Elipse "amassada à mão". */
export function blob(cx: number, cy: number, rx: number, ry = rx, seed = 1, wobble = 0.06, n = 10) {
  const r = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * 2 * wobble;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return closedCurve(pts);
}

/** Estrela de pontas arredondadas. */
export function softStar(cx: number, cy: number, outer: number, inner: number, points = 5, rot = -90) {
  const pts: Pt[] = [];
  for (let i = 0; i < points * 2; i++) {
    const a = ((rot + (i * 180) / points) * Math.PI) / 180;
    const r = i % 2 === 0 ? outer : inner;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return closedCurve(pts);
}

/** Folha (ou mecha de cabelo) com o talo na origem, apontando para cima. */
export const leafPath = (l: number, w = l * 0.42) =>
  `M0 0C${f(w)} ${f(-l * 0.12)} ${f(w * 1.1)} ${f(-l * 0.72)} 0 ${f(-l)}C${f(-w * 1.1)} ${f(-l * 0.72)} ${f(-w)} ${f(-l * 0.12)} 0 0Z`;

export type Wave = readonly [amp: number, periods: number, phase: number];

/** Altura de um relevo que se repete a cada W (emenda perfeita nas bordas). */
export function ridgeY(x: number, W: number, baseY: number, waves: readonly Wave[]) {
  let y = baseY;
  for (const [a, p, ph] of waves) y += a * Math.sin((2 * Math.PI * p * x) / W + ph);
  return y;
}

/** Morro/faixa de chão que se repete a cada W, preenchido até `bottom`. */
export function ridge(W: number, bottom: number, baseY: number, waves: readonly Wave[], step = 40) {
  const pts: Pt[] = [];
  for (let x = 0; x <= W; x += step) pts.push([x, ridgeY(x, W, baseY, waves)]);
  return `${openCurve(pts)}L${W} ${bottom}L0 ${bottom}Z`;
}

/** Faixa de chão/morro de largura qualquer, com o topo dado por f(x), preenchida até `bottom`. */
export function ridgeFn(width: number, bottom: number, f: (x: number) => number, step = 40) {
  const pts: Pt[] = [];
  for (let x = -step; x <= width + step; x += step) pts.push([x, f(x)]);
  return `${openCurve(pts)}L${width + step} ${bottom}L${-step} ${bottom}Z`;
}

/** Posições espalhadas ao longo de [x0, x1], com espaçamento médio `gap` e um pouco de sorteio. */
export function spread(x0: number, x1: number, gap: number, seed: number, jitter = 0.35) {
  const r = rng(seed);
  const out: { x: number; k: number; i: number }[] = [];
  let i = 0;
  for (let x = x0 + r() * gap * 0.5; x < x1; x += gap * (1 - jitter + r() * jitter * 2)) out.push({ x, k: r(), i: i++ });
  return out;
}

/** Posições onde repetir um objeto para a camada emendar sem costura. */
export function wrapXs(x: number, halfWidth: number, W: number) {
  const xs = [x];
  if (x - halfWidth < 0) xs.push(x + W);
  if (x + halfWidth > W) xs.push(x - W);
  return xs;
}
