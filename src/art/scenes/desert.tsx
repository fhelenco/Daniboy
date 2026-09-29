import { band } from '../Clay';
import { ridgeFn, spread } from '../geom';
import { Agave, Barrel, Boulder, Cloud, Flower, Grass, Mesa, Oasis, Pebble, Saguaro, Signpost, Spire, Sun } from '../culled';
import { Band, DANI_X, H, SkyFill, atStop, type LayerProps } from './common';

// Deserto (referência: céu pêssego ao pôr do sol, mesas e torres de pedra, dunas,
// oásis com palmeiras, pedregulhos vermelhos, cactos com florzinhas).

const farY = (x: number) => 612 + 14 * Math.sin(x / 300) + 8 * Math.sin(x / 111);
const duneY = (x: number) => 652 + 30 * Math.sin(x / 380 + 2) + 12 * Math.sin(x / 140);
const nearY = (x: number) => 716 + 10 * Math.sin(x / 210);
const pathY = (x: number) => 752 + 5 * Math.sin(x / 150) + 3 * Math.sin(x / 53);

function Sky({ width }: LayerProps) {
  return (
    <>
      <SkyFill c="skyDesert" width={width} />
      <Sun x={1150} y={300} r={78} c="sunPale" />
      <Cloud x={260} y={150} s={0.9} seed={5} c="cloudWarm" />
      <Cloud x={640} y={240} s={0.42} seed={6} c="cloudWarm" />
      <Cloud x={1450} y={110} s={0.62} seed={7} c="cloudWarm" />
      <Cloud x={1800} y={200} s={0.7} seed={8} c="cloudWarm" />
      <Cloud x={2040} y={90} s={0.4} seed={9} c="cloudWarm" />
    </>
  );
}

function Far({ width }: LayerProps) {
  return (
    <>
      {spread(-100, width, 330, 61).map((p) =>
        p.k < 0.3 ? (
          <Spire key={p.i} x={p.x} y={606} w={26 + p.k * 30} h={170 + p.k * 180} />
        ) : (
          <Mesa key={p.i} x={p.x} y={606} w={90 + p.k * 110} h={110 + p.k * 120} seed={p.i + 1} />
        ),
      )}
      <path d={ridgeFn(width, H, farY)} fill={band('dune')} opacity={0.85} />
    </>
  );
}

function Mid({ width }: LayerProps) {
  const oases = spread(700, width, 2500, 71).map((p) => p.x);
  const nearOasis = (x: number) => oases.some((o) => Math.abs(o - x) < 280);
  return (
    <>
      <Band d={ridgeFn(width, H, duneY)} c="sand" />
      <path d={ridgeFn(width, H, (x) => duneY(x) + 40 + 10 * Math.sin(x / 90))} fill="rgb(200 120 60 / 0.12)" />
      {oases.map((ox) => (
        <Oasis key={ox} x={ox} y={duneY(ox) + 46} s={0.8} />
      ))}
      {spread(0, width, 260, 72)
        .filter((p) => !nearOasis(p.x))
        .map((p) =>
          p.k < 0.5 ? (
            <Saguaro key={p.i} x={p.x} y={duneY(p.x) + 30} s={0.32 + p.k * 0.25} flip={p.i % 2 === 1} />
          ) : (
            <Boulder key={p.i} x={p.x} y={duneY(p.x) + 34} s={0.35 + p.k * 0.2} seed={p.i + 1} />
          ),
        )}
    </>
  );
}

function Near({ width }: LayerProps) {
  return (
    <>
      <Band d={ridgeFn(width, H, nearY)} c="dune" />
      {spread(0, width, 190, 81).map((p) => {
        const y = nearY(p.x) + 18;
        if (p.k < 0.3) return <Boulder key={p.i} x={p.x} y={y} s={0.6 + p.k} seed={p.i + 1} flip={p.i % 2 === 1} />;
        if (p.k < 0.5) return <Barrel key={p.i} x={p.x} y={y} s={0.75} flower={p.k > 0.4} />;
        if (p.k < 0.7) return <Agave key={p.i} x={p.x} y={y} s={0.8} />;
        if (p.k < 0.85) return <Saguaro key={p.i} x={p.x} y={y} s={0.6} />;
        return <Grass key={p.i} x={p.x} y={y} s={0.9} c="dryGrass" />;
      })}
    </>
  );
}

function Ground({ width }: LayerProps) {
  return (
    <>
      <Band d={ridgeFn(width, H, (x) => pathY(x) - 16)} c="dune" />
      {spread(0, width, 110, 91).map((p) =>
        p.k < 0.6 ? (
          <Grass key={p.i} x={p.x} y={pathY(p.x) + 4} s={0.75} c="dryGrass" />
        ) : (
          <Flower key={p.i} x={p.x} y={pathY(p.x) + 2} s={0.7} petal="bloom" center="pollen" />
        ),
      )}
      <Band d={ridgeFn(width, H, pathY)} c="sand" />
      <path d={ridgeFn(width, H, (x) => pathY(x) + 56)} fill="rgb(255 225 170 / 0.14)" />
      {spread(0, width, 40, 92).map((p) => (
        <Pebble key={p.i} x={p.x} y={796 + p.k * 90} s={0.5 + p.k * 0.8} seed={p.i + 3} c={p.k > 0.5 ? 'boulder' : 'rock'} />
      ))}
      <Signpost x={DANI_X - 170} y={754} s={0.9} />
    </>
  );
}

function Front({ width, depth, stops }: LayerProps) {
  const frames = [{ x: 60, flip: false }, ...stops.map((s, k) => ({ x: atStop(s, depth, k % 2 ? 1540 : 60), flip: k % 2 === 1 }))];
  const nearFrame = (x: number) => frames.some((f) => Math.abs(f.x - x) < 280);
  return (
    <>
      {spread(0, width, 400, 101)
        .filter((p) => !nearFrame(p.x))
        .map((p) => (p.k < 0.5 ? <Agave key={p.i} x={p.x} y={950} s={1.3} /> : <Barrel key={p.i} x={p.x} y={960} s={1.2} />))}
      {frames.map((f, i) => (
        <g key={i}>
          <Saguaro x={f.x + (f.flip ? -130 : 130)} y={990} s={1.35} flip={f.flip} />
          <Boulder x={f.x} y={1000} s={2.1} seed={i + 5} flip={f.flip} />
          <Barrel x={f.x + (f.flip ? -60 : 60)} y={930} s={1.1} />
        </g>
      ))}
    </>
  );
}

export const desertLayers = [Sky, Far, Mid, Near, Ground, Front];
