import { memo, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import type { Environment } from '../data/types';
import { trailEnd } from '../data/environments';
import { STOP_GAP } from '../game/useWalkLoop';
import { assetOk, useAssetsChecked } from '../assets/preload';
import { genericLayers, sceneArt } from '../art/scenes';
import { CullCtx, createCullStore, culled } from '../art/cull';
import { TILE_OVERLAP, TILE_W, isBaked, tileCount, tileSrc, tileTier, type TileTier } from '../data/tiles';
import { DESIGN_W, DesignStage, MAX_W, STAGE_H, useStage } from './Stage';

// O cenário é feito de faixas longas (uma por camada), cada uma andando na sua velocidade:
// o céu parado, o fundo devagar, o chão junto com o Daniboy e a frente mais rápido.
// Cada camada (menos o céu) é mostrada como uma fila de imagens já prontas (`src/data/tiles.ts`); se existir
// o PNG da camada, ele é usado (repetindo na horizontal); e se faltar tudo, o desenho em massinha (SVG).

export const stopsOf = (env: Environment) => env.animals.map((a) => a.x - STOP_GAP).sort((a, b) => a - b);

/** Largura da faixa: o quanto ela anda até o fim da trilha, mais a tela mais larga possível. */
export const stripWidth = (depth: number, end: number) => (depth === 0 ? MAX_W : Math.ceil(depth * end + MAX_W + 200));

/** Desenho de uma camada (memorizado: só redesenha se o lugar ou a largura mudarem). */
const LayerArt = memo(function LayerArt({ env, index, width, stopsKey }: { env: Environment; index: number; width: number; stopsKey: string }) {
  const Art = (sceneArt[env.id] ?? genericLayers)[index];
  if (!Art) return null;
  const stops = stopsKey ? stopsKey.split(',').map(Number) : [];
  return (
    <svg width={width} height={STAGE_H} viewBox={`0 0 ${width} ${STAGE_H}`} className="block" style={{ overflow: 'visible' }} aria-hidden>
      <Art width={width} depth={env.layers[index].depth} stops={stops} />
    </svg>
  );
});

/** Tamanho das imagens de cenário para esta tela (m: celular; g: computador/tablet); null = sem imagens, usa o SVG. */
export function useTileTier(env: Environment): TileTier | null {
  const { scale } = useStage();
  return tileTier(env.id, scale * (typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1));
}

/** Uma peça de 1024 do cenário: só existe no DOM enquanto está perto da tela. */
const Tile = culled(function Tile({ x, src }: { x: number; w: number; src: string }) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      decoding="async"
      style={{ position: 'absolute', left: x, top: 0, width: TILE_W + TILE_OVERLAP, height: STAGE_H, maxWidth: 'none' }}
    />
  );
});

function Strip({ env, index, worldX, width, stopsKey }: { env: Environment; index: number; worldX: MotionValue<number>; width: number; stopsKey: string }) {
  const { src, depth } = env.layers[index];
  const x = useTransform(worldX, (v) => -v * depth);
  const { extra, w } = useStage();
  const tier = useTileTier(env);
  // Só os objetos perto da tela ficam no DOM: a janela acompanha o quanto a faixa já andou.
  const cull = useMemo(() => createCullStore(w, worldX.get() * depth), [w, worldX, depth]);
  useEffect(() => worldX.on('change', (v) => cull.setPos(v * depth)), [cull, worldX, depth]);
  // o desenho tem 900 de altura e fica ancorado embaixo; em telas mais altas sobra céu por cima
  return (
    // Sem `willChange`: uma camada própria de 10 000+ de largura provavelmente derrubou o Safari do iPhone.
    <motion.div className="pointer-events-none absolute left-0" style={{ x, top: extra, width, height: STAGE_H }}>
      {assetOk(src) ? (
        <div className="h-full w-full" style={{ backgroundImage: `url(${src})`, backgroundRepeat: 'repeat-x', backgroundSize: 'auto 100%' }} />
      ) : (
        <CullCtx.Provider value={cull}>
          {tier && isBaked(index) ? (
            Array.from({ length: tileCount(width) }, (_, k) => (
              <Tile key={k} x={k * TILE_W} w={TILE_W + TILE_OVERLAP} src={tileSrc(tier, env.id, index, k)} />
            ))
          ) : (
            <LayerArt env={env} index={index} width={width} stopsKey={stopsKey} />
          )}
        </CullCtx.Provider>
      )}
    </motion.div>
  );
}

function Layers({ env, worldX, front, width: fixedWidth }: { env: Environment; worldX: MotionValue<number>; front: boolean; width?: number }) {
  useAssetsChecked(env.layers.map((l) => l.src));
  const stopsKey = useMemo(() => stopsOf(env).join(','), [env]);
  const end = trailEnd(env);
  return (
    <>
      {env.layers.map((layer, i) =>
        layer.depth > 1 !== front ? null : (
          <Strip
            key={i}
            env={env}
            index={i}
            worldX={worldX}
            width={fixedWidth ?? stripWidth(layer.depth, end)}
            stopsKey={stopsKey}
          />
        ),
      )}
    </>
  );
}

/** Tudo que fica atrás do Daniboy e dos bichos. */
export const SceneBack = ({ env, worldX }: { env: Environment; worldX: MotionValue<number> }) => (
  <Layers env={env} worldX={worldX} front={false} />
);

/** Plantas, pedras e árvores que passam na frente do Daniboy. */
export const SceneFront = ({ env, worldX }: { env: Environment; worldX: MotionValue<number> }) => (
  <Layers env={env} worldX={worldX} front />
);

/**
 * O começo da trilha parado, como uma foto (tela de início e cards).
 * Sem `height`/`width`: preenche o palco inteiro. Com eles: um recorte do desenho de 1600×900,
 * na altura dada (usado no card de "escolher lugar").
 */
export function ScenePreview({ env, height, width }: { env: Environment; height?: number; width?: number }) {
  const worldX = useMotionValue(0);
  const stage = useStage();
  const full = height === undefined || width === undefined;
  const k = full ? 1 : height / STAGE_H;
  const box = full
    ? { left: 0, top: 0, width: stage.w, height: stage.h, transform: undefined }
    : { left: (width - DESIGN_W * k) / 2, top: 0, width: DESIGN_W, height: STAGE_H, transform: `scale(${k})` };
  const layers = (
    <div className="absolute" style={{ ...box, transformOrigin: '0 0' }}>
      <Layers env={env} worldX={worldX} front={false} width={MAX_W} />
      <Layers env={env} worldX={worldX} front width={MAX_W} />
    </div>
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* as faixas se ancoram embaixo sozinhas; num recorte (card) não há altura extra */}
      {full ? layers : <DesignStage>{layers}</DesignStage>}
    </div>
  );
}
