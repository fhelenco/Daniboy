import { band } from '../Clay';
import { ridgeFn, spread } from '../geom';
import { Clover, Cloud, Fern, Flower, Grass, LogBridge, Pebble, Pine, Plant, PuffTree, Rock, RockSpires, Signpost, Sun, TwistedTree, Waterfall, WoodFence } from '../culled';
import { ANIMAL_SCREEN_X, Band, DANI_X, H, SkyFill, atStop, type LayerProps } from './common';

// Floresta (referência: tronco retorcido e folhas redondas emoldurando, samambaias,
// pedras com musgo, riacho com ponte de troncos, pinheiros e picos de pedra ao fundo).

const farY = (x: number) => 560 + 18 * Math.sin(x / 260) + 10 * Math.sin(x / 97);
const hillY = (x: number) => 640 + 26 * Math.sin(x / 400 + 1) + 12 * Math.sin(x / 150);
const bankY = (x: number) => 712 + 8 * Math.sin(x / 180);
const pathY = (x: number) => 752 + 5 * Math.sin(x / 130) + 3 * Math.sin(x / 47);

function Sky({ width }: LayerProps) {
  return (
    <>
      <SkyFill c="skyForest" width={width} />
      <Sun x={1280} y={140} r={60} c="sunPale" />
      <Cloud x={300} y={150} s={0.9} seed={1} />
      <Cloud x={760} y={250} s={0.45} seed={2} />
      <Cloud x={1040} y={110} s={0.65} seed={3} />
      <Cloud x={1520} y={290} s={0.4} seed={4} />
      <Cloud x={1830} y={190} s={0.7} seed={5} />
      <Cloud x={2040} y={330} s={0.4} seed={6} />
    </>
  );
}

function Far({ width }: LayerProps) {
  return (
    <>
      {spread(-150, width, 260, 11).map((p) => (
        <RockSpires key={p.i} x={p.x} y={575} s={0.8 + p.k * 0.7} seed={p.i + 1} />
      ))}
      <path d={ridgeFn(width, H, farY)} fill={band('haze')} />
      {spread(0, width, 64, 12).map((p) => (
        <Pine key={p.i} x={p.x} y={farY(p.x) + 16} s={0.24 + p.k * 0.12} c="hazePine" grain={false} />
      ))}
    </>
  );
}

function Mid({ width }: LayerProps) {
  const falls = spread(900, width, 2600, 21).map((p) => p.x);
  const nearFall = (x: number) => falls.some((f) => Math.abs(f - x) < 240);
  const fences = spread(500, width, 1900, 23).map((p) => p.x).filter((x) => !nearFall(x) && !nearFall(x + 210));
  return (
    <>
      <Band d={ridgeFn(width, H, hillY)} c="hill" />
      {spread(0, width, 90, 24)
        .filter((p) => !nearFall(p.x))
        .map((p) => (
          <PuffTree key={`b${p.i}`} x={p.x} y={hillY(p.x) + 40} s={0.38 + p.k * 0.2} seed={p.i + 40} tones={p.k > 0.5 ? ['leafDark', 'leaf', 'lime'] : undefined} />
        ))}
      {falls.map((fx) => (
        <Waterfall key={fx} x={fx} y={hillY(fx) + 50} s={0.85} />
      ))}
      {spread(0, width, 150, 22)
        .filter((p) => !nearFall(p.x))
        .map((p) =>
          p.k < 0.45 ? (
            <Pine key={p.i} x={p.x} y={hillY(p.x) + 22} s={0.55 + p.k * 0.5} grain={false} />
          ) : (
            <PuffTree key={p.i} x={p.x} y={hillY(p.x) + 24} s={0.7 + p.k * 0.4} seed={p.i + 3} tones={p.k > 0.72 ? ['leaf', 'lime', 'lime'] : undefined} />
          ),
        )}
      {fences.map((fx) => (
        <WoodFence key={fx} x={fx} ys={[0, 1, 2, 3].map((j) => hillY(fx + j * 70) + 40)} />
      ))}
    </>
  );
}

function Near({ width }: LayerProps) {
  return (
    <>
      <Band d={ridgeFn(width, H, bankY)} c="moss" />
      {spread(0, width, 200, 31).map((p) => {
        const y = bankY(p.x) + 18;
        if (p.k < 0.3) return <Fern key={p.i} x={p.x} y={y} s={0.8 + p.k} seed={p.i + 1} />;
        if (p.k < 0.55) return <Rock key={p.i} x={p.x} y={y} s={0.55 + p.k * 0.4} seed={p.i + 1} moss />;
        if (p.k < 0.8) return <Plant key={p.i} x={p.x} y={y} s={0.85} seed={p.i + 1} />;
        return <PuffTree key={p.i} x={p.x} y={y + 8} s={0.95} seed={p.i + 5} tones={['leaf', 'lime', 'lime']} />;
      })}
      {spread(0, width, 58, 32).map((p) => (
        <Flower
          key={p.i}
          x={p.x}
          y={bankY(p.x) + 22 + p.k * 14}
          s={0.7 + p.k * 0.4}
          petal={p.k > 0.55 ? 'pollen' : 'petal'}
          center={p.k > 0.55 ? 'beak' : 'pollen'}
        />
      ))}
    </>
  );
}

function Ground({ width, stops }: LayerProps) {
  // Ponte no espaço livre entre um bicho e a próxima parada do Daniboy (a cada dois bichos).
  const bridges = stops.slice(0, -1).flatMap((s, k) => {
    const a = s + ANIMAL_SCREEN_X + 170;
    const b = stops[k + 1] + DANI_X - 150;
    return k % 2 === 0 && b - a > 360 ? [(a + b) / 2 - 150] : [];
  });
  return (
    <>
      <Band d={ridgeFn(width, H, (x) => pathY(x) - 18)} c="moss" />
      {spread(0, width, 80, 41).map((p) =>
        p.k < 0.5 ? (
          <Clover key={p.i} x={p.x} y={pathY(p.x) + 2} s={0.8} seed={p.i + 1} />
        ) : (
          <Grass key={p.i} x={p.x} y={pathY(p.x) + 4} s={0.8} />
        ),
      )}
      <Band d={ridgeFn(width, H, pathY)} c="dirt" />
      <path d={ridgeFn(width, H, (x) => pathY(x) + 56)} fill="rgb(255 220 170 / 0.16)" />
      {spread(0, width, 42, 42).map((p) => (
        <Pebble key={p.i} x={p.x} y={796 + p.k * 90} s={0.5 + p.k * 0.8} seed={p.i + 1} />
      ))}
      <Signpost x={DANI_X - 170} y={754} s={0.9} />
      {bridges.map((bx) => (
        <LogBridge key={bx} x={bx} w={300} />
      ))}
    </>
  );
}

function Front({ width, depth, stops }: LayerProps) {
  // Árvores enormes emolduram a cena no começo e em cada parada (alternando os lados).
  const trees = [{ x: 40, flip: false }, ...stops.map((s, k) => ({ x: atStop(s, depth, k % 2 ? 1560 : 50), flip: k % 2 === 1 }))];
  const nearTree = (x: number) => trees.some((t) => Math.abs(t.x - x) < 260);
  return (
    <>
      {spread(0, width, 380, 51)
        .filter((p) => !nearTree(p.x))
        .map((p) =>
          p.k < 0.5 ? (
            <Fern key={p.i} x={p.x} y={965} s={1.3 + p.k * 0.4} seed={p.i + 2} />
          ) : (
            <g key={p.i}>
              <Rock x={p.x} y={990} s={1.25} seed={p.i + 2} moss />
              <Flower x={p.x - 90} y={915} s={1.6} />
              <Flower x={p.x + 100} y={925} s={1.4} petal="pollen" center="beak" />
            </g>
          ),
        )}
      {trees.map((t, i) => (
        <TwistedTree key={i} x={t.x} y={990} s={0.95} seed={i * 7 + 1} flip={t.flip} />
      ))}
    </>
  );
}

export const forestLayers = [Sky, Far, Mid, Near, Ground, Front];
