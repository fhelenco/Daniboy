import { motion } from 'motion/react';
import { BigButton } from './BigButton';
import { ArrowIcon } from './icons';
import { useMinUnits } from './Stage';

// Botão gigante de andar: segurando, o Daniboy anda; soltando, ele para.
// `dir` 1 = para a frente (direita, verde e maior), -1 = voltar (esquerda, laranja).
export function WalkButton({ dir, holding, onHold }: { dir: 1 | -1; holding: boolean; onHold: (on: boolean) => void }) {
  const release = () => onHold(false);
  const forward = dir === 1;
  const minUnits = useMinUnits();
  // pelo menos 120 px reais (o de voltar, 100), mesmo em celulares pequenos
  const size = Math.max(forward ? 180 : 150, minUnits(forward ? 120 : 100));
  return (
    <BigButton
      label={forward ? 'Andar' : 'Voltar a andar para trás'}
      color={forward ? '#3fae4a' : '#f7952a'}
      rim={forward ? '#ffc247' : '#ffd66b'}
      size={size}
      style={{ position: 'absolute', ...(forward ? { right: 90 } : { left: 60 }), bottom: 80, touchAction: 'none' }}
      animate={holding ? { scale: 0.9 } : forward ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={holding ? { type: 'spring', stiffness: 500, damping: 18 } : { duration: 1.4, repeat: Infinity }}
      whileTap={undefined}
      whileHover={undefined}
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
        <ArrowIcon size={size * 0.62} />
      </motion.div>
    </BigButton>
  );
}
