import { motion } from 'motion/react';
import type { Animal } from '../data/types';
import { AnimalArt } from '../art/animals';
import { C } from '../art/Clay';
import { softStar } from '../art/geom';

const SIZE = 260;

// Figurinha: sai do card e voa em arco até o botão do álbum, girando e diminuindo.
export function StickerFly({ animal, from, to, onDone }: { animal: Animal; from: { x: number; y: number }; to: { x: number; y: number }; onDone: () => void }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return (
    <motion.div
      className="pointer-events-none absolute z-50"
      style={{ left: from.x - SIZE / 2, top: from.y - SIZE / 2, width: SIZE, height: SIZE }}
      initial={{ x: 0, y: 0, scale: 0.6, rotate: 0 }}
      animate={{ x: [0, dx * 0.2, dx], y: [0, -180, dy], scale: [0.6, 1, 0.28], rotate: [0, -14, 10] }}
      transition={{ duration: 1.2, ease: 'easeInOut', times: [0, 0.4, 1] }}
      onAnimationComplete={onDone}
    >
      {/* figurinha recortada, igual à do álbum */}
      <div className="diecut h-full w-full -rotate-3" style={{ ['--o' as string]: '9px' }}>
        <AnimalArt animal={animal} />
      </div>
    </motion.div>
  );
}

/** Estrelinhas que estouram em volta do álbum quando a figurinha chega. */
export function StarBurst({ x, y }: { x: number; y: number }) {
  return (
    <div className="pointer-events-none absolute z-50" style={{ left: x, top: y }}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <motion.svg
            key={i}
            viewBox="0 0 40 40"
            width={36}
            height={36}
            className="absolute"
            style={{ left: -18, top: -18 }}
            initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
            animate={{ x: Math.cos(a) * 90, y: Math.sin(a) * 90, scale: [0, 1.2, 0], rotate: 120 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <C d={softStar(20, 20, 18, 7, 5)} c="pollen" grain={false} />
          </motion.svg>
        );
      })}
    </div>
  );
}
