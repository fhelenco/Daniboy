import { motion, type HTMLMotionProps } from 'motion/react';
import { useStage } from './Stage';

export const clayGradient = (c: string) =>
  `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${c} 55%, white), ${c} 55%, color-mix(in srgb, ${c} 70%, black))`;

type Props = HTMLMotionProps<'button'> & {
  /** Nome para adultos/leitores de tela; a criança só vê o ícone. */
  label: string;
  color: string;
  size?: number;
};

// Botão redondo de massinha. Mínimo de 80px para dedos pequenos.
export function BigButton({ label, color, size = 110, style, children, ...rest }: Props) {
  // Alvo de toque de pelo menos 80 px reais, mesmo em celulares pequenos (onde o palco é reduzido).
  const { scale } = useStage();
  const s = Math.max(80 / scale, size);
  return (
    <motion.button
      type="button"
      aria-label={label}
      className="clay flex cursor-pointer items-center justify-center rounded-full border-0 outline-none"
      style={{ width: s, height: s, background: clayGradient(color), ...style }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.88, scaleY: 0.8 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
