import { band, C } from '../Clay';
import { blob, ridgeFn, spread } from '../geom';
import { Cloud, Foam, Log, Pebble, Rock, Sun } from '../props';
import { RockSpires } from '../forestProps';
import { BarnacleRock, Cliff, Conch, Coral, Footprints, IcePlant, Islet, Lighthouse, RopeFence, Shell, TidePool } from '../beachProps';
import { Band, DANI_X, H, SkyFill, atStop, type LayerProps } from './common';

// Praia (referência: céu azul, ilhotas de pedra com pinheiros, farol no penhasco,
// mar turquesa com espuma, piscinas naturais, troncos, corais, conchas e suculentas).

const wave = (base: number, a: number, f: number) => (x: number) => base + a * Math.sin(x / f) + a * 0.5 * Math.sin(x / (f * 0.37));
const shoreY = (x: number) => 704 + 8 * Math.sin(x / 170) + 4 * Math.sin(x / 61);
const pathY = (x: number) => 748 + 5 * Math.sin(x / 140);

function Sky({ width }: LayerProps) {
  return (
    <>
      <SkyFill c="skyOcean" width={width} />
      <Sun x={1440} y={130} r={56} />
      <Cloud x={330} y={160} s={0.9} seed={8} />
      <Cloud x={760} y={240} s={0.4} seed={9} />
      <Cloud x={1100} y={120} s={0.6} seed={10} />
      <Cloud x={1750} y={250} s={0.6} seed={11} />
      <Cloud x={2030} y={130} s={0.4} seed={12} />
    </>
  );
}

function Far({ width }: LayerProps) {
  return (
    <>
      {spread(-100, width, 700, 111).map((p) => (
        <RockSpires key={p.i} x={p.x} y={452} s={0.45 + p.k * 0.35} seed={p.i + 3} c="mountain" o={0.75} />
      ))}
      <rect y={448} width={width} height={H - 448} fill={band('deep')} />
      {spread(0, width, 60, 112).map((p) => (
        <path key={p.i} d={`M${p.x} ${462 + p.k * 60}h${10 + p.k * 16}`} stroke="rgb(255 255 255 / 0.55)" strokeWidth={2.5} strokeLinecap="round" />
      ))}
      {spread(200, width, 520, 113).map((p) =>
        p.i === 1 ? (
          <Lighthouse key={p.i} x={p.x} y={470} s={0.55} />
        ) : (
          <Islet key={p.i} x={p.x} y={466} s={0.3 + p.k * 0.45} seed={p.i + 1} pines={1 + (p.i % 3)} />
        ),
      )}
    </>
  );
}

function WaveRow({ width, y, c, seed }: { width: number; y: (x: number) => number; c: 'turq' | 'sea'; seed: number }) {
  return (
    <>
      <Band d={ridgeFn(width, H, y)} c={c} grain={false} />
      {spread(0, width, 330, seed).map((p) => (
        <Foam key={p.i} x={p.x} y={y(p.x) + 2} w={110 + p.k * 120} seed={p.i + seed} />
      ))}
    </>
  );
}

function Mid({ width }: LayerProps) {
  return (
    <>
      <WaveRow width={width} y={wave(528, 6, 70)} c="turq" seed={121} />
      <WaveRow width={width} y={wave(594, 8, 90)} c="sea" seed={122} />
      {spread(300, width, 700, 123).map((p) => (
        <g key={p.i}>
          <Rock x={p.x} y={640} s={0.35 + p.k * 0.25} seed={p.i + 7} />
          <Foam x={p.x - 40} y={640} w={80} seed={p.i} />
        </g>
      ))}
      <WaveRow width={width} y={wave(654, 7, 80)} c="turq" seed={124} />
      <Cliff x={60} y={680} s={0.9} />
    </>
  );
}

function Near({ width }: LayerProps) {
  const foamXs = spread(0, width, 26, 131);
  return (
    <>
      <Band d={ridgeFn(width, H, shoreY)} c="wetSand" />
      {foamXs.map((p) => (
        <C key={p.i} d={blob(p.x, shoreY(p.x) - 2, 20, 9, p.i + 1, 0.2, 7)} c="foam" />
      ))}
      {spread(500, width, 1300, 132).map((p) => (
        <TidePool key={p.i} x={p.x} y={shoreY(p.x) + 20} s={0.9} />
      ))}
      {spread(0, width, 300, 133).map((p) =>
        p.k < 0.4 ? (
          <BarnacleRock key={p.i} x={p.x} y={shoreY(p.x) + 22} s={0.6 + p.k * 0.5} seed={p.i + 1} flip={p.i % 2 === 1} />
        ) : p.k < 0.6 ? (
          <Log key={p.i} x={p.x} y={shoreY(p.x) + 26} s={0.55} c="drift" end="drift" />
        ) : p.k < 0.85 ? (
          <IcePlant key={p.i} x={p.x} y={shoreY(p.x) + 24} s={0.9} seed={p.i + 1} />
        ) : (
          <Coral key={p.i} x={p.x} y={shoreY(p.x) + 24} s={1} />
        ),
      )}
    </>
  );
}

function Ground({ width }: LayerProps) {
  return (
    <>
      <Band d={ridgeFn(width, H, pathY)} c="sand" />
      <path d={ridgeFn(width, H, (x) => pathY(x) + 60)} fill="rgb(255 245 225 / 0.2)" />
      {spread(0, width, 44, 141).map((p) => (
        <Pebble key={p.i} x={p.x} y={796 + p.k * 90} s={0.45 + p.k * 0.6} seed={p.i + 5} />
      ))}
      {spread(200, width, 260, 142).map((p) =>
        p.k < 0.35 ? (
          <Shell key={p.i} x={p.x} y={800 + p.k * 180} s={0.7 + p.k} c={p.i % 2 ? 'pink' : 'shell'} />
        ) : p.k < 0.55 ? (
          <Conch key={p.i} x={p.x} y={820 + p.k * 60} s={0.9} />
        ) : p.k < 0.8 ? (
          <Footprints key={p.i} x={p.x} y={830 + p.k * 30} />
        ) : (
          <IcePlant key={p.i} x={p.x} y={pathY(p.x) + 8} s={0.7} seed={p.i} />
        ),
      )}
      <RopeFence x={DANI_X - 300} y={760} posts={3} />
    </>
  );
}

function Front({ width, depth, stops }: LayerProps) {
  const frames = [{ x: 60, flip: false }, ...stops.map((s, k) => ({ x: atStop(s, depth, k % 2 ? 1540 : 60), flip: k % 2 === 1 }))];
  const nearFrame = (x: number) => frames.some((f) => Math.abs(f.x - x) < 260);
  return (
    <>
      {spread(0, width, 420, 151)
        .filter((p) => !nearFrame(p.x))
        .map((p) =>
          p.k < 0.5 ? (
            <IcePlant key={p.i} x={p.x} y={950} s={1.5} seed={p.i + 1} />
          ) : (
            <Shell key={p.i} x={p.x} y={930} s={1.7} />
          ),
        )}
      {frames.map((f, i) => (
        <g key={i}>
          <BarnacleRock x={f.x} y={1000} s={2} seed={i + 21} flip={f.flip} />
          <Coral x={f.x + (f.flip ? -150 : 150)} y={945} s={2} />
          <IcePlant x={f.x + (f.flip ? 60 : -60)} y={940} s={1.4} seed={i + 3} />
        </g>
      ))}
    </>
  );
}

export const oceanLayers = [Sky, Far, Mid, Near, Ground, Front];
