import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { BigButton } from './BigButton';
import { ArrowIcon } from './icons';
import { useMinUnits, useStage } from './Stage';

/**
 * Tempo mínimo andando depois de um toque (ms). Um toque rápido no celular dura uns 100 ms, o que só
 * arrastaria o Daniboy alguns pixels: assim, tocar (ou segurar) sempre dá pelo menos uns passinhos.
 */
const MIN_WALK_MS = 800;

// Botão gigante de andar: segurando, o Daniboy anda; soltando, ele para (depois do tempo mínimo).
// `dir` 1 = para a frente (direita, verde e maior), -1 = voltar (esquerda, laranja).
export function WalkButton({ dir, holding, onHold }: { dir: 1 | -1; holding: boolean; onHold: (on: boolean) => void }) {
  const forward = dir === 1;
  const minUnits = useMinUnits();
  const { safe } = useStage();
  // pelo menos 120 px reais (o de voltar, 100), mesmo em celulares pequenos
  const size = Math.max(forward ? 180 : 150, minUnits(forward ? 120 : 100));

  const onHoldRef = useRef(onHold);
  onHoldRef.current = onHold;
  const timer = useRef(0);
  const detach = useRef<(() => void) | null>(null);

  // ao sair da tela, cancela o que estiver pendente
  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      detach.current?.();
    },
    [],
  );

  const press = () => {
    window.clearTimeout(timer.current);
    detach.current?.();
    const t0 = performance.now();
    onHoldRef.current(true);

    // O fim do toque é ouvido na janela (e não no botão): assim vale mesmo que o dedo escorregue para fora.
    const end = () => {
      detach.current?.();
      const wait = MIN_WALK_MS - (performance.now() - t0);
      if (wait > 0) timer.current = window.setTimeout(() => onHoldRef.current(false), wait);
      else onHoldRef.current(false);
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    detach.current = () => {
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      detach.current = null;
    };
  };

  return (
    <BigButton
      label={forward ? 'Andar' : 'Voltar a andar para trás'}
      color={forward ? '#3fae4a' : '#f7952a'}
      rim={forward ? '#ffc247' : '#ffd66b'}
      size={size}
      style={{ position: 'absolute', ...(forward ? { right: 90 + safe.r } : { left: 60 + safe.l }), bottom: 80 + safe.b, touchAction: 'none' }}
      animate={holding ? { scale: 0.9 } : forward ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={holding ? { type: 'spring', stiffness: 500, damping: 18 } : { duration: 1.4, repeat: Infinity }}
      whileTap={undefined}
      whileHover={undefined}
      onPointerDown={(e) => {
        e.stopPropagation();
        press();
      }}
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
