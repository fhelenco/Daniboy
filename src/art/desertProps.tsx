import { band, C, Line, S, Shadow, Sheen } from './Clay';
import { blob, ell, leafPath, rng, rrect, softStar } from './geom';
import type { ClayColor } from './palette';
import { at, Palm, Plant, type P } from './props';

const spines = (xs: number[], y0: number, y1: number, step = 26) =>
  xs.flatMap((sx) =>
    Array.from({ length: Math.floor((y1 - y0) / step) }, (_, i) => (
      <circle key={`${sx}-${i}`} cx={sx} cy={y0 + i * step + ((sx / 7) % 2) * 8} r={2.4} fill="#f5e6a8" />
    )),
  );

export function Saguaro({ x, y, s = 1, flip = false }: P & { flip?: boolean }) {
  return (
    <g transform={at(x, y, s, flip)}>
      <Shadow cx={0} cy={2} rx={80} ry={12} />
      <S d="M-28 -120H-58Q-74 -120 -74 -136V-196" c="cactus" w={36} />
      <S d="M28 -150H56Q72 -150 72 -166V-236" c="cactus" w={34} />
      <C d={rrect(-32, -300, 64, 304, 32)} c="cactus" />
      <Line d="M-15 -282V-12M0 -292V-6M15 -282V-12" color="rgb(30 80 40 / 0.25)" />
      {spines([-22, -7, 8, 23], -276, -14)}
      {spines([-74], -190, -140, 22)}
      {spines([72], -228, -170, 22)}
    </g>
  );
}

export function Barrel({ x, y, s = 1, flower = true }: P & { flower?: boolean }) {
  return (
    <g transform={at(x, y, s)}>
      <Shadow cx={0} cy={2} rx={54} ry={10} />
      <C d={blob(0, -44, 44, 46, 31, 0.04)} c="cactus" />
      <Line d="M-30 -10Q-42 -46 -26 -80M-12 -4Q-17 -48 -10 -88M12 -4Q17 -48 10 -88M30 -10Q42 -46 26 -80" color="rgb(30 80 40 / 0.3)" />
      {spines([-28, -11, 11, 28], -70, -12, 18)}
      {flower && (
        <>
          <C d={softStar(0, -92, 18, 9, 6)} c="beak" />
          <C d={ell(0, -92, 6)} c="pollen" />
        </>
      )}
    </g>
  );
}

export function Agave({ x, y, s = 1 }: P) {
  return (
    <g transform={at(x, y, s)}>
      {[-72, -48, -24, 0, 24, 48, 72].map((a, i) => (
        <C key={a} d={leafPath(i % 2 ? 54 : 70, 13)} c="agave" t={`rotate(${a})`} />
      ))}
    </g>
  );
}

/** Mesa de pedra: topo reto, camadas horizontais e sulcos verticais. */
export function Mesa({ x, y, w = 160, h = 170, c = 'mesaHaze', seed = 1 }: { x: number; y: number; w?: number; h?: number; c?: ClayColor; seed?: number }) {
  const r = rng(seed);
  const d = `M${-w} 0C${-w * 0.92} ${-h * 0.4} ${-w * 0.84} ${-h * 0.85} ${-w * 0.74} ${-h}Q${-w * 0.7} ${-h - 12} ${-w * 0.6} ${-h - 12}H${w * 0.6}Q${w * 0.7} ${-h - 12} ${w * 0.74} ${-h}C${w * 0.84} ${-h * 0.85} ${w * 0.92} ${-h * 0.4} ${w} 0Z`;
  const grooves = Array.from({ length: 3 }, () => -w * 0.55 + r() * w * 1.1);
  return (
    <g transform={`translate(${x.toFixed(1)} ${y})`}>
      <C d={d} c={c} />
      <path d={`M${-w * 0.86} ${-h * 0.3}Q0 ${-h * 0.36} ${w * 0.86} ${-h * 0.3}L${w * 0.92} ${-h * 0.18}Q0 ${-h * 0.24} ${-w * 0.92} ${-h * 0.18}Z`} fill="rgb(255 220 190 / 0.25)" />
      <path d={`M${-w * 0.78} ${-h * 0.66}Q0 ${-h * 0.72} ${w * 0.78} ${-h * 0.66}L${w * 0.8} ${-h * 0.58}Q0 ${-h * 0.64} ${-w * 0.8} ${-h * 0.58}Z`} fill="rgb(150 60 30 / 0.16)" />
      <Line d={grooves.map((gx) => `M${gx.toFixed(0)} ${-h + 6}C${(gx + 10).toFixed(0)} ${-h * 0.75} ${(gx - 8).toFixed(0)} ${-h * 0.5} ${(gx + 4).toFixed(0)} ${-h * 0.25}`).join('')} color="rgb(140 60 35 / 0.18)" w={6} />
      <path d={`M${w * 0.3} ${-h - 12}H${w * 0.6}Q${w * 0.7} ${-h - 12} ${w * 0.74} ${-h}C${w * 0.84} ${-h * 0.85} ${w * 0.92} ${-h * 0.4} ${w} 0H${w * 0.45}Z`} fill="rgb(120 40 20 / 0.14)" />
      <Sheen cx={-w * 0.4} cy={-h * 0.8} rx={w * 0.25} ry={h * 0.12} o={0.4} />
    </g>
  );
}

/** Torre fina de pedra (como as "chaminés" da referência). */
export function Spire({ x, y, w = 40, h = 220, c = 'mesaHaze' }: { x: number; y: number; w?: number; h?: number; c?: ClayColor }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y})`}>
      <C d={`M${-w * 1.4} 0C${-w} ${-h * 0.4} ${-w} ${-h * 0.8} ${-w * 0.8} ${-h}Q0 ${-h - 22} ${w * 0.8} ${-h}C${w} ${-h * 0.8} ${w} ${-h * 0.4} ${w * 1.4} 0Z`} c={c} />
      <Line d={`M${-w * 0.3} ${-h + 10}V-20M${w * 0.35} ${-h + 20}V-30`} color="rgb(140 60 35 / 0.2)" w={4} />
    </g>
  );
}

/** Pedregulho vermelho grande, com marcas em arco (como massinha amassada com o dedo). */
export function Boulder({ x, y, s = 1, seed = 1, flip = false }: P & { flip?: boolean }) {
  return (
    <g transform={at(x, y, s, flip)}>
      <Shadow cx={0} cy={2} rx={120} ry={16} />
      <C d={blob(70, -26, 46, 30, seed + 1, 0.12, 8)} c="boulder" />
      <C d={blob(0, -58, 96, 64, seed, 0.08, 10)} c="boulder" />
      <Line d="M-50 -80Q-10 -100 40 -84M-60 -56Q-6 -76 52 -58M-44 -32Q0 -46 44 -34" color="rgb(130 55 30 / 0.2)" w={4} />
      <Sheen cx={-34} cy={-92} rx={34} ry={14} o={0.5} />
    </g>
  );
}

/** Oásis: laguinho turquesa com palmeiras, arbustos e pedras. */
export function Oasis({ x, y, s = 1 }: P) {
  return (
    <g transform={at(x, y, s)}>
      <C d={ell(0, 0, 240, 40)} c="sand" />
      <path d={ell(0, -4, 200, 28)} fill={band('turq')} />
      <Line d="M-120 -8Q0 -16 120 -8M-80 4Q10 -2 90 4" color="rgb(255 255 255 / 0.55)" w={3} />
      <Palm x={-150} y={-10} s={0.55} lean={-1} />
      <Palm x={-60} y={-24} s={0.7} lean={0.6} />
      <Palm x={110} y={-18} s={0.6} lean={1} />
      <Palm x={190} y={-6} s={0.45} lean={-0.5} />
      <Plant x={-200} y={4} s={0.6} seed={3} c="leaf" c2="leafLight" />
      <Plant x={30} y={-26} s={0.5} seed={4} c="leaf" c2="leafLight" />
      <Plant x={220} y={6} s={0.55} seed={5} c="leaf" c2="leafLight" />
      <C d={blob(-230, 16, 26, 14, 6)} c="boulder" />
      <C d={blob(160, 22, 22, 12, 7)} c="boulder" />
    </g>
  );
}
