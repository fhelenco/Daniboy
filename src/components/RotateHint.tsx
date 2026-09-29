import { motion } from 'motion/react';
import { DaniboyFigure } from './DaniboyFigure';

// Celular em pé: pede para girar o aparelho, só com desenho (a criança não lê).
export function RotateHint() {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10"
      style={{ background: 'radial-gradient(circle at 50% 40%, #fff5e2, #ffcf9a)' }}
    >
      <div className="relative h-[34vmin] w-[34vmin]">
        <motion.svg
          viewBox="0 0 120 120"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: [0, 0, -90, -90, 0] }}
          transition={{ duration: 3.2, times: [0, 0.25, 0.5, 0.85, 1], repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        >
          <rect x="34" y="10" width="52" height="100" rx="12" fill="#3a8fe0" />
          <rect x="39" y="20" width="42" height="78" rx="6" fill="#fff6e3" />
          <circle cx="60" cy="104" r="3" fill="#fff" opacity="0.8" />
        </motion.svg>
      </div>
      <div className="h-[26vmin] w-[18vmin]">
        <DaniboyFigure pose="wave" className="h-full w-full" />
      </div>
    </div>
  );
}
