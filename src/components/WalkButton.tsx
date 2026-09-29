import { motion } from 'motion/react';
import { clayGradient } from './BigButton';
import { ArrowIcon } from './icons';
import { useMinUnits } from './Stage';

// Botão gigante de andar: segurando, o Daniboy anda; soltando, ele para.
// `dir` 1 = para a frente (direita, botão maior), -1 = voltar (esquerda).
export function WalkButton({ dir, holding, onHold }: { dir: 1 | -1; holding: boolean; onHold: (on: boolean) => void }) {
  const release = () => onHold(false);
  const forward = dir === 1;
  const minUnits = useMinUnits();
  // pelo menos 120 px reais (o de voltar, 100), mesmo em celulares pequenos
  const size = Math.max(forward ? 180 : 150, minUnits(forward ? 120 : 100));
  return (
    <motion.button
      type="button"
      aria-label={forward ? 'Andar' : 'Voltar a andar para trás'}
      className="clay absolute flex cursor-pointer touch-none items-center justify-center rounded-full border-0 outline-none"
      style={{
        ...(forward ? { right: 90 } : { left: 60 }),
        bottom: 80,
        width: size,
        height: size,
        background: clayGradient(forward ? '#ff9a3c' : '#5aa9e6'),
      }}
      animate={holding ? { scale: 0.9 } : forward ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={holding ? { type: 'spring', stiffness: 500, damping: 18 } : { duration: 1.4, repeat: Infinity }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        onHold(true);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      onContextMenu={(e) => e.preventDefault()}
    >
      <motion.div
        style={{ scaleX: dir }}
        animate={holding ? { x: [0, 12 * dir, 0] } : { x: 0 }}
        transition={holding ? { duration: 0.5, repeat: Infinity } : { duration: 0.2 }}
      >
        <ArrowIcon size={size * 0.66} />
      </motion.div>
    </motion.button>
  );
}
