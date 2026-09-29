import { useMemo } from 'react';
import { motion } from 'motion/react';
import { rng } from '../art/geom';
import { clayGradient } from './BigButton';
import { useStage } from './Stage';

const COLORS = ['#ff8a3d', '#4cbf5e', '#3a8fe0', '#f2c230', '#ff6f91', '#8d6fe8', '#2fbfb0'];

// Confete suave de massinha: bolinhas e pedacinhos caindo devagar, uma vez só.
export function Confetti({ pieces = 60 }: { pieces?: number }) {
  const { w, h } = useStage();
  const items = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: pieces }, (_, i) => ({
      x: r() * w,
      size: 18 + r() * 18,
      delay: r() * 2.2,
      duration: 3.2 + r() * 2.4,
      drift: (r() - 0.5) * 240,
      spin: (r() - 0.5) * 720,
      color: COLORS[i % COLORS.length],
      shape: i % 3,
    }));
  }, [pieces, w]);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {items.map((p, i) => (
        <motion.div
          key={i}
          className="clay absolute"
          style={{
            left: p.x,
            top: -50,
            width: p.size,
            height: p.shape === 2 ? p.size * 0.55 : p.size,
            borderRadius: p.shape === 0 ? '50%' : p.shape === 1 ? '32%' : 8,
            background: clayGradient(p.color),
          }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: h + 100, x: [0, p.drift * 0.6, p.drift], rotate: p.spin, opacity: [1, 1, 0.8] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}
