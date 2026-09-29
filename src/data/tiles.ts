// Cenário "assado": cada camada comprida do cenário (menos o céu) vira uma fila de imagens de 1024 de largura,
// geradas a partir do desenho em massinha por `tools/bake-tiles.mjs`. O SVG original continua no código
// (é dele que as imagens saem). Mover uma imagem é barato; redesenhar milhares de formas SVG a cada quadro não
// é: o Safari (iPhone e Mac) andava a 1–10 quadros por segundo.
//
// Dois tamanhos, para nunca gastar memória à toa nem perder nitidez:
//  m = celulares e telas pequenas: 1,5 pixel de imagem por unidade de desenho (um celular mostra ~1,3 a 1,45)
//  g = computador e tablet, telas nítidas: 2,2 pixels por unidade

/** Largura de cada peça, em unidades de desenho. */
export const TILE_W = 1024;
/** Quanto cada peça avança sobre a próxima, para não aparecer fresta entre elas. */
export const TILE_OVERLAP = 4;
/** Camadas assadas (o céu, 0, continua em SVG: é leve). */
export const TILE_LAYERS = [1, 2, 3, 4, 5];

export type TileTier = 'm' | 'g';
/** Pixels de imagem por unidade de desenho. Mantenha igual ao `TIERS` de tools/bake-tiles.mjs. */
export const TILE_SCALES: Record<TileTier, number> = { m: 1.5, g: 2.2 };
/** Até esta densidade (pixels reais por unidade de desenho) usa-se o tamanho m; acima, o g. */
export const TIER_LIMIT = 1.7;
/** Lugares que já têm as peças geradas em public/assets/tiles/<tamanho>/<lugar>/. */
export const BAKED_ENVS: string[] = ['floresta', 'deserto', 'oceano'];

export const tileTier = (envId: string, pxPerUnit: number): TileTier | null =>
  BAKED_ENVS.includes(envId) ? (pxPerUnit <= TIER_LIMIT ? 'm' : 'g') : null;
export const tileCount = (width: number) => Math.ceil(width / TILE_W);
export const tileSrc = (tier: TileTier, envId: string, layer: number, k: number) => `/assets/tiles/${tier}/${envId}/L${layer}-${k}.webp`;
export const isBaked = (layer: number) => TILE_LAYERS.includes(layer);
/** As peças do começo da trilha (carregadas na tela de carregando). */
export const firstTiles = (tier: TileTier, envId: string, layerCount: number) =>
  Array.from({ length: layerCount }, (_, i) => i).filter(isBaked).flatMap((i) => [0, 1, 2].map((k) => tileSrc(tier, envId, i, k)));
