import { motion } from 'motion/react';
import { band, C } from '../art/Clay';
import { rrect, ridgeFn } from '../art/geom';
import { Cloud, Flower, Foam, Grass, Palm, Pine, Plant, PuffTree, Rock, Sun } from '../art/props';
import { Fern } from '../art/forestProps';
import { Agave, Barrel, Boulder, Saguaro } from '../art/desertProps';
import { Conch, Shell } from '../art/beachProps';
import { DESIGN_W, STAGE_H, useStage } from './Stage';

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
/** Chão: morro na floresta, dunas no deserto e descendo até a praia. */
const groundY = (x: number) => 702 + 14 * Math.sin(x / 130) + 8 * Math.sin(x / 47) + 46 * smooth(980, 1140, x);

export interface CardSpot {
  x: number;
  width: number;
  bottom: number;
}

// Fundo da tela "escolher lugar": céu, e embaixo de cada card um pedaço do seu lugar
// (floresta, deserto, praia), com os cards presos em postes como placas.
export function PlacesBackdrop({ cards }: { cards: CardSpot[] }) {
  // O desenho é de 1600×900; em telas mais largas/altas o céu e o chão se estendem pelos lados e por cima.
  const { w, h, extra } = useStage();
  const m = (w - DESIGN_W) / 2;
  const wide = (f: (x: number) => number) => (x: number) => f(x - m); // ridge desenhado de 0 a w, deslocado de -m
  return (
    <svg viewBox={`${-m} ${-extra} ${w} ${h}`} className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="places-sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={STAGE_H}>
          <stop offset="0" stopColor="#8fcff5" />
          <stop offset="0.55" stopColor="#cfe9f6" />
          <stop offset="1" stopColor="#ffe3bf" />
        </linearGradient>
        <linearGradient id="places-ground" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={DESIGN_W} y2="0">
          <stop offset="0" stopColor="#9fd263" />
          <stop offset="0.27" stopColor="#8cc450" />
          <stop offset="0.33" stopColor="#c9b25a" />
          <stop offset="0.39" stopColor="#eca45c" />
          <stop offset="0.58" stopColor="#f0ad64" />
          <stop offset="0.7" stopColor="#f6d49c" />
          <stop offset="1" stopColor="#f2c98a" />
        </linearGradient>
        <linearGradient id="places-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(255 255 255 / 0.18)" />
          <stop offset="1" stopColor="rgb(60 30 10 / 0.18)" />
        </linearGradient>
      </defs>

      <rect x={-m} y={-extra} width={w} height={h} fill="url(#places-sky)" />
      <Sun x={820} y={96} r={54} c="sunPale" />
      <motion.g animate={{ x: [0, 50, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}>
        <Cloud x={420} y={96} s={0.5} seed={2} />
        <Cloud x={1210} y={120} s={0.62} seed={3} />
      </motion.g>

      {/* morrinhos azulados ao longe */}
      <g transform={`translate(${-m} 0)`}>
        <path d={ridgeFn(w, STAGE_H, wide((x) => 640 + 22 * Math.sin(x / 210 + 1)))} fill={band('haze')} opacity={0.8} />
      </g>

      {/* mar atrás da praia */}
      <path d={rrect(930, 650, 720, 140, 30)} fill={band('sea')} />
      <Foam x={1000} y={672} w={220} seed={4} />
      <Foam x={1300} y={690} w={200} seed={6} />

      {/* postes das placas (ficam atrás dos cards) */}
      {cards.flatMap((c) =>
        [c.x + c.width * 0.22, c.x + c.width * 0.78].map((px) => (
          <C key={px} d={rrect(px - 13, c.bottom - 40, 26, groundY(px) - c.bottom + 60, 10)} c="wood" />
        )),
      )}

      {/* chão contínuo: floresta → deserto → praia */}
      <g transform={`translate(${-m} 0)`}>
        <path d={ridgeFn(w, STAGE_H, wide(groundY))} fill="url(#places-ground)" />
        <path d={ridgeFn(w, STAGE_H, wide(groundY))} fill="url(#places-shade)" />
        <path d={ridgeFn(w, STAGE_H, wide(groundY))} fill="url(#grain)" />
      </g>

      {/* floresta */}
      <Pine x={330} y={groundY(330) + 10} s={0.55} />
      <PuffTree x={460} y={groundY(460) + 12} s={0.72} seed={4} />
      <Pine x={70} y={groundY(70) + 10} s={0.45} />
      <Fern x={230} y={groundY(230) + 18} s={0.7} seed={3} />
      <Plant x={510} y={groundY(510) + 16} s={0.6} seed={2} />
      {[260, 300, 380, 420, 540].map((x, i) => (
        <Flower key={x} x={x} y={groundY(x) + 30 + (i % 2) * 20} s={0.8} petal={i % 2 ? 'pollen' : 'petal'} center={i % 2 ? 'beak' : 'pollen'} />
      ))}
      {[290, 400, 480].map((x) => (
        <Grass key={x} x={x} y={groundY(x) + 60} s={0.8} />
      ))}

      {/* deserto: uma duna mais escura e capim seco misturando com o gramado */}
      <path d={`M560 ${groundY(560) + 40}C640 ${groundY(640) - 30} 780 ${groundY(780) - 40} 880 ${groundY(880) + 10}C940 ${groundY(940) + 30} 990 ${groundY(990) + 40} 1020 ${groundY(1020) + 50}L560 ${groundY(560) + 60}Z`} fill={band('dune')} opacity={0.55} />
      {[500, 545, 590, 630].map((x, i) => (
        <Grass key={x} x={x} y={groundY(x) + 40 + (i % 2) * 24} s={0.75} c={i < 2 ? 'moss' : 'dryGrass'} />
      ))}
      <Saguaro x={1010} y={groundY(1010) + 30} s={0.38} flip />
      <Saguaro x={610} y={groundY(610) + 14} s={0.55} />
      <Boulder x={960} y={groundY(960) + 20} s={0.5} seed={3} />
      <Barrel x={900} y={groundY(900) + 40} s={0.6} />
      <Agave x={700} y={groundY(700) + 50} s={0.6} />
      <Grass x={820} y={groundY(820) + 44} s={0.7} c="dryGrass" />

      {/* praia */}
      <Palm x={1560} y={groundY(1560) + 40} s={0.46} lean={-1} />
      <Rock x={1110} y={groundY(1110) + 18} s={0.45} seed={8} />
      <Shell x={1240} y={groundY(1240) + 50} s={0.9} c="pink" />
      <Conch x={1360} y={groundY(1360) + 70} s={0.9} />
      <Shell x={1440} y={groundY(1440) + 110} s={0.8} />
    </svg>
  );
}
