import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ClayDefs } from './art/ClayDefs';
import { sceneArt } from './art/scenes';
import { environments, trailEnd } from './data/environments';
import { stopsOf, stripWidth } from './components/Scene';
import { TILE_OVERLAP, TILE_W, tileCount } from './data/tiles';
import { STAGE_H } from './components/Stage';

// Página usada só por `tools/bake-tiles.mjs`: desenha UMA camada do cenário, sem fundo, mostrando a peça
// pedida (`window.__setTile(k)`) para virar imagem. Não faz parte do jogo (o build só inclui o index.html).
const q = new URLSearchParams(location.search);
const env = environments.find((e) => e.id === q.get('env')) ?? environments[0];
const layer = Number(q.get('layer') ?? 1);
const Art = sceneArt[env.id][layer];
const depth = env.layers[layer].depth;
const width = stripWidth(depth, trailEnd(env));
const w = TILE_W + TILE_OVERLAP;
const w2 = window as unknown as { __setTile: (k: number) => void; __ready: boolean; __count: number };
w2.__count = tileCount(width);

function Bake() {
  const [cur, setCur] = useState({ tile: 0 });
  const tile = cur.tile;
  useEffect(() => {
    w2.__setTile = (k) => {
      w2.__ready = false;
      setCur({ tile: k }); // objeto novo: sempre redesenha, mesmo repetindo a peça
    };
    w2.__ready = true;
  }, []);
  useEffect(() => {
    // dois quadros depois de pintar a peça, avisa que pode tirar a foto
    let a = 0;
    a = requestAnimationFrame(() => requestAnimationFrame(() => (w2.__ready = true)));
    return () => cancelAnimationFrame(a);
  }, [cur]);
  return (
    <>
      <ClayDefs />
      <div id="tile" style={{ position: 'absolute', left: 0, top: 0, width: w, height: STAGE_H, overflow: 'hidden' }}>
        <svg width={w} height={STAGE_H} viewBox={`${tile * TILE_W} 0 ${w} ${STAGE_H}`} style={{ display: 'block', overflow: 'hidden' }}>
          <Art width={width} depth={depth} stops={stopsOf(env)} />
        </svg>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<Bake />);
