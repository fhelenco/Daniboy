import { motion } from 'motion/react';
import type { TapEffect } from '../data/types';
import { leafPath } from '../art/geom';

export interface Burst {
  id: number;
  x: number;
  y: number;
}

const LEAF_COLORS = ['url(#c-leaf)', 'url(#c-leafLight)', 'url(#c-pollen)'];

// Reação divertida ao tocar num lugar "vazio": folhas, areia ou bolhas.
export function TapBurst({ x, y, kind }: Burst & { kind: TapEffect }) {
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y }}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.4;
        const dx = Math.cos(a) * (50 + (i % 3) * 20);
        if (kind === 'bubbles') {
          const size = 16 + (i % 3) * 10;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{ width: size, height: size, left: -size / 2, top: -size / 2, border: '3px solid rgb(255 255 255 / 0.9)', background: 'rgb(255 255 255 / 0.25)' }}
              initial={{ x: 0, y: 0, scale: 0.3, opacity: 1 }}
              animate={{ x: dx * 0.6, y: -140 - (i % 4) * 30, scale: 1, opacity: [1, 1, 0] }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          );
        }
        if (kind === 'sand') {
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{ width: 12, height: 12, left: -6, top: -6, background: i % 2 ? '#f0c47a' : '#e0a55e' }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: dx, y: [0, -60 - (i % 3) * 20, 60], opacity: [1, 1, 0] }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          );
        }
        return (
          <motion.svg
            key={i}
            viewBox="-14 -30 28 32"
            width={30}
            height={34}
            className="absolute"
            style={{ left: -15, top: -17 }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: [0, dx, dx * 1.3], y: [0, -50 - (i % 3) * 20, 130], rotate: 200 + i * 30, opacity: [1, 1, 0] }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          >
            <path d={leafPath(28, 12)} fill={LEAF_COLORS[i % 3]} />
          </motion.svg>
        );
      })}
    </div>
  );
}
