import type { Environment } from './types';
import { desertAnimals, forestAnimals, oceanAnimals } from './animals';

// Para um lugar novo: crie a lista de animais em animals.ts e adicione mais um item aqui.
// As camadas vão do fundo para a frente; `depth` é a velocidade de cada uma
// (0 = parada, 1 = junto com o chão, maior que 1 = passa na frente do Daniboy).
// Se um PNG de camada não existir, o jogo desenha a camada em massinha no lugar.
const layers = (folder: string) => [
  { src: `/assets/${folder}/camada-ceu.png`, depth: 0 },
  { src: `/assets/${folder}/camada-longe.png`, depth: 0.12 },
  { src: `/assets/${folder}/camada-meio.png`, depth: 0.4 },
  { src: `/assets/${folder}/camada-perto.png`, depth: 0.7 },
  { src: `/assets/${folder}/camada-chao.png`, depth: 1 },
  { src: `/assets/${folder}/camada-frente.png`, depth: 1.35 },
];

export const environments: Environment[] = [
  {
    id: 'floresta',
    name: 'Floresta',
    cover: '/assets/forest/capa.webp',
    nameAudio: '/assets/forest/nome.mp3',
    bgColor: '#4a5a2a',
    tapEffect: 'leaves',
    layers: layers('forest'),
    animals: forestAnimals,
  },
  {
    id: 'deserto',
    name: 'Deserto',
    cover: '/assets/desert/capa.webp',
    nameAudio: '/assets/desert/nome.mp3',
    bgColor: '#a9582f',
    tapEffect: 'sand',
    layers: layers('desert'),
    animals: desertAnimals,
  },
  {
    id: 'oceano',
    name: 'Oceano',
    cover: '/assets/ocean/capa.webp',
    nameAudio: '/assets/ocean/nome.mp3',
    bgColor: '#3f8fc9',
    tapEffect: 'bubbles',
    layers: layers('ocean'),
    animals: oceanAnimals,
  },
];

export const findEnvironment = (id: string | null) =>
  environments.find((e) => e.id === id) ?? null;

export const trailEnd = (env: Environment) =>
  env.trailLength ?? Math.max(0, ...env.animals.map((a) => a.x)) + 1200;
