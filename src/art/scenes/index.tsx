import type { ComponentType } from 'react';
import { ridgeFn } from '../geom';
import { Band, H, SkyFill, type LayerProps } from './common';
import { desertLayers } from './desert';
import { forestLayers } from './forest';
import { oceanLayers } from './ocean';

export type LayerArt = ComponentType<LayerProps>;

/** Desenho de cada camada, na mesma ordem de `layers` nos dados (céu, longe, meio, perto, chão, frente). */
export const sceneArt: Record<string, LayerArt[]> = {
  floresta: forestLayers,
  deserto: desertLayers,
  oceano: oceanLayers,
};

// Lugar novo ainda sem desenho: céu, morro e chão simples, até chegarem as imagens.
export const genericLayers: LayerArt[] = [
  ({ width }) => <SkyFill c="skyForest" width={width} />,
  () => null,
  ({ width }) => <Band d={ridgeFn(width, H, (x) => 640 + 30 * Math.sin(x / 400))} c="hill" />,
  () => null,
  ({ width }) => <Band d={ridgeFn(width, H, (x) => 752 + 6 * Math.sin(x / 150))} c="dirt" />,
  () => null,
];
