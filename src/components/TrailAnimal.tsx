import { useState } from 'react';
import { motion } from 'motion/react';
import type { Animal } from '../data/types';
import { AnimalArt } from '../art/animals';
import { C } from '../art/Clay';
import { softStar } from '../art/geom';

/** Linha do chão da trilha (onde ficam os pés), em px do palco. */
export const GROUND_Y = 790;

// Um bicho na trilha. `calling`: o Daniboy parou aqui e o bicho pula e brilha pedindo um toque.
export function TrailAnimal({ animal, calling, onTap }: { animal: Animal; calling: boolean; onTap: () => void }) {
  const [jumps, setJumps] = useState(0);
  return (
    <button
      type="button"
      aria-label={animal.name}
      className="pointer-events-auto absolute cursor-pointer border-0 bg-transparent p-0 outline-none"
      style={{ left: animal.x - 150, top: GROUND_Y - 286 - (animal.y ?? 0), width: 300, height: 300 }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={() => {
        setJumps((j) => j + 1);
        onTap();
      }}
    >
      {calling && (
        <motion.div
          className="pointer-events-none absolute -inset-12 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgb(255 255 255 / 0.95), rgb(255 236 140 / 0.75) 35%, rgb(255 200 80 / 0.3) 55%, transparent 70%)',
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.08, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
      {calling &&
        [[-10, 30], [290, 60], [250, -20]].map(([x, y], i) => (
          <motion.svg
            key={i}
            viewBox="0 0 40 40"
            width={40}
            height={40}
            className="pointer-events-none absolute"
            style={{ left: x, top: y }}
            animate={{ scale: [0, 1, 0], rotate: [0, 90] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.35 }}
          >
            <C d={softStar(20, 20, 18, 7, 4)} c="pollen" grain={false} />
          </motion.svg>
        ))}
      <motion.div
        key={jumps}
        className="h-full w-full"
        style={{ originY: 1 }}
        initial={{ y: 0 }}
        animate={jumps ? { y: [0, -70, 0], scaleY: [1, 1.08, 1] } : { y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="h-full w-full"
          style={{ originY: 1 }}
          animate={
            calling
              ? { y: [0, -40, 0, 0], scaleY: [0.9, 1.08, 0.92, 1], scaleX: [1.08, 0.94, 1.06, 1] }
              : { y: [0, -3, 0], scaleY: [1, 1.02, 1], scaleX: 1 }
          }
          transition={calling ? { duration: 1.1, repeat: Infinity, times: [0, 0.35, 0.7, 1] } : { duration: 2.6, repeat: Infinity }}
        >
          <AnimalArt animal={animal} />
        </motion.div>
      </motion.div>
    </button>
  );
}
