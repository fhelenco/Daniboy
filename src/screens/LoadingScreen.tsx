import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import type { Environment } from '../data/types';
import { PALETTE, type ClayColor } from '../art/palette';
import { C } from '../art/Clay';
import { ell } from '../art/geom';
import { Cloud, Flower, Palm, Pine, Plant, PuffTree, Rock, Sun } from '../art/props';
import { Fern } from '../art/forestProps';
import { Agave, Barrel, Boulder, Saguaro } from '../art/desertProps';
import { Conch, Coral, IcePlant, Shell } from '../art/beachProps';
import { AnimalArt } from '../art/animals';
import { DaniboyFigure } from '../components/DaniboyFigure';
import { Frame } from '../components/Stage';
import { WoodBar, WoodSign } from '../components/wood';

// Carregando: o Daniboy anda num "planetinha" de massinha que gira embaixo dele,
// com as coisas do lugar escolhido e os bichos que ele vai encontrar passando.

const R = 860; // raio do planetinha
const TOP = 700; // onde fica o topo do planetinha (os pés do Daniboy)
const SPIN = 34; // segundos por volta

type PropArt = { w: number; h: number; art: ReactNode };

interface Theme {
  sky: ClayColor;
  ground: [string, string, string];
  sun: ClayColor;
  cloud: ClayColor;
  props: PropArt[];
}

const THEMES: Record<string, Theme> = {
  floresta: {
    sky: 'skyForest',
    ground: ['#bfe583', '#86c04c', '#4f8a2d'],
    sun: 'sunPale',
    cloud: 'cloud',
    props: [
      { w: 170, h: 230, art: <Pine x={0} y={0} s={0.75} /> },
      { w: 60, h: 60, art: <Flower x={0} y={0} s={1.4} /> },
      { w: 200, h: 240, art: <PuffTree x={0} y={0} s={0.85} seed={4} tones={['leaf', 'lime', 'lime']} /> },
      { w: 200, h: 140, art: <Fern x={0} y={0} s={0.85} seed={3} /> },
      { w: 150, h: 90, art: <Rock x={0} y={0} s={0.7} seed={5} moss /> },
      { w: 60, h: 60, art: <Flower x={0} y={0} s={1.4} petal="pollen" center="beak" /> },
      { w: 150, h: 120, art: <Plant x={0} y={0} s={0.9} seed={6} /> },
    ],
  },
  deserto: {
    sky: 'skyDesert',
    ground: ['#f9c483', '#e8964c', '#b8652c'],
    sun: 'sunPale',
    cloud: 'cloudWarm',
    props: [
      { w: 190, h: 240, art: <Saguaro x={0} y={0} s={0.72} /> },
      { w: 120, h: 130, art: <Barrel x={0} y={0} s={1} /> },
      { w: 240, h: 150, art: <Boulder x={0} y={0} s={0.9} seed={3} /> },
      { w: 150, h: 100, art: <Agave x={0} y={0} s={1.1} /> },
      { w: 190, h: 240, art: <Saguaro x={0} y={0} s={0.6} flip /> },
      { w: 60, h: 60, art: <Flower x={0} y={0} s={1.3} petal="bloom" /> },
      { w: 120, h: 130, art: <Barrel x={0} y={0} s={0.8} flower={false} /> },
    ],
  },
  oceano: {
    sky: 'skyOcean',
    ground: ['#fde4ae', '#eec07c', '#c8904e'],
    sun: 'sun',
    cloud: 'cloud',
    props: [
      { w: 300, h: 300, art: <Palm x={0} y={0} s={0.7} /> },
      { w: 90, h: 70, art: <Shell x={0} y={0} s={1.4} /> },
      { w: 150, h: 90, art: <Rock x={0} y={0} s={0.7} seed={9} /> },
      { w: 110, h: 110, art: <Coral x={0} y={0} s={1.6} /> },
      { w: 120, h: 90, art: <IcePlant x={0} y={0} s={1.2} seed={2} /> },
      { w: 100, h: 70, art: <Conch x={0} y={0} s={1.4} /> },
      { w: 90, h: 70, art: <Shell x={0} y={0} s={1.2} c="pink" /> },
    ],
  },
};

const gradient = (c: ClayColor) => {
  const [a, b, d] = PALETTE[c];
  return `linear-gradient(${a}, ${b} 55%, ${d})`;
};

/** Um objeto (ou bicho) fincado no planetinha, no ângulo `deg`. */
function OnPlanet({ deg, w, h, children }: { deg: number; w: number; h: number; children: ReactNode }) {
  return (
    <div
      className="absolute"
      style={{ left: R - w / 2, top: -h + 14, width: w, height: h, transformOrigin: `${w / 2}px ${h - 14 + R}px`, transform: `rotate(${deg}deg)` }}
    >
      {children}
    </div>
  );
}

function PropSvg({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <svg viewBox={`${-w / 2} ${-h} ${w} ${h}`} width={w} height={h} overflow="visible" aria-hidden>
      {children}
    </svg>
  );
}

export function LoadingScreen({ env, progress }: { env: Environment; progress: number }) {
  const theme = THEMES[env.id] ?? THEMES.floresta;
  // coisas do lugar e bichos alternados em volta do planetinha
  const items: { key: string; w: number; h: number; node: ReactNode }[] = [];
  const animals = env.animals;
  const props = [...theme.props, ...theme.props.slice().reverse()]; // duas voltas de enfeites
  const total = props.length + animals.length;
  // um bicho a cada três objetos, para eles aparecerem espaçados
  for (let i = 0, p = 0, a = 0; i < total; i++) {
    if (i % 3 === 1 && a < animals.length) {
      const an = animals[a++];
      items.push({ key: an.id, w: 170, h: 170, node: <AnimalArt animal={an} /> });
    } else if (p < props.length) {
      const pr = props[p++];
      items.push({ key: `p${p}`, w: pr.w, h: pr.h, node: <PropSvg w={pr.w} h={pr.h}>{pr.art}</PropSvg> });
    } else if (a < animals.length) {
      const an = animals[a++];
      items.push({ key: an.id, w: 170, h: 170, node: <AnimalArt animal={an} /> });
    }
  }
  const [g0, g1, g2] = theme.ground;

  return (
    <div className="absolute inset-0 overflow-clip" style={{ background: gradient(theme.sky) }}>
      <Frame>
      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" aria-hidden>
        <Sun x={1330} y={170} r={62} c={theme.sun} />
        <motion.g animate={{ x: [0, -60, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}>
          <Cloud x={300} y={250} s={0.7} seed={1} c={theme.cloud} />
          <Cloud x={1060} y={300} s={0.45} seed={2} c={theme.cloud} />
        </motion.g>
      </svg>

      {/* placa com o nome do lugar (para os adultos) e a barra de progresso de madeira */}
      <motion.div
        className="absolute left-1/2"
        style={{ top: 34, x: '-50%' }}
        initial={{ y: -160, scale: 0.7 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      >
        <WoodSign w={600} h={140} r={56} seed={8}>
          <span className="text-[96px] leading-none text-[#fff4d6]" style={{ textShadow: '0 6px 0 rgb(80 40 10 / 0.55), 0 0 16px rgb(60 30 5 / 0.35)' }}>
            {env.name}
          </span>
        </WoodSign>
      </motion.div>

      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 196 }}>
        <WoodBar w={760} h={70} value={progress} />
      </div>

      {/* planetinha girando (o chão anda para trás, o Daniboy anda no lugar) */}
      <motion.div
        className="absolute"
        style={{ left: 800 - R, top: TOP, width: R * 2, height: R * 2, willChange: 'transform' }}
        animate={{ rotate: -360 }}
        transition={{ duration: SPIN, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((it, i) => (
          <OnPlanet key={it.key} deg={(i / items.length) * 360 + 8} w={it.w} h={it.h}>
            {it.node}
          </OnPlanet>
        ))}
        <svg viewBox={`0 0 ${R * 2} ${R * 2}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <radialGradient id="planet" cx="0.5" cy="0.08" r="0.9">
              <stop offset="0" stopColor={g0} />
              <stop offset="0.3" stopColor={g1} />
              <stop offset="0.75" stopColor={g2} />
            </radialGradient>
          </defs>
          <circle cx={R} cy={R} r={R} fill="url(#planet)" />
          <circle cx={R} cy={R} r={R} fill="url(#grain)" />
          {Array.from({ length: 36 }, (_, i) => {
            const a = (i / 36) * Math.PI * 2;
            return <C key={i} d={ell(R + Math.cos(a) * (R - 40), R + Math.sin(a) * (R - 40), 12, 8)} c="rgb(255 255 255 / 0.18)" grain={false} />;
          })}
        </svg>
      </motion.div>

      <div className="absolute" style={{ left: 800 - 150, top: TOP - 440 * 0.957 + 6, width: 300, height: 440 }}>
        <DaniboyFigure pose="walk" className="h-full w-full" />
      </div>
      </Frame>
    </div>
  );
}
