import type { CSSProperties, ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { useStage } from './Stage';

export const clayGradient = (c: string) =>
  `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${c} 55%, white), ${c} 55%, color-mix(in srgb, ${c} 70%, black))`;

/**
 * Disco de biscoito: aro claro, disco colorido afundadinho, brilho de massinha e o ícone creme por cima.
 * É só o visual (sem clique): serve de botão, de emblema em card, etc.
 */
export function Disc({
  size,
  color,
  rim,
  className = '',
  style,
  children,
}: {
  size: number;
  color: string;
  rim?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const ring = rim ?? `color-mix(in srgb, ${color} 40%, #fff0c0)`;
  return (
    <span
      className={`relative flex items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 28%, color-mix(in srgb, ${ring} 60%, white), ${ring} 60%, color-mix(in srgb, ${ring} 75%, #8a5a20))`,
        boxShadow:
          'inset -5px -8px 12px rgb(110 60 10 / 0.22), inset 5px 6px 10px rgb(255 255 255 / 0.55), 0 14px 22px rgb(70 40 10 / 0.3)',
        ...style,
      }}
    >
      {/* disco de cor, afundadinho dentro do aro */}
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          inset: '8.5%',
          background: clayGradient(color),
          boxShadow: 'inset 0 7px 10px rgb(0 0 0 / 0.2), inset 0 -5px 8px rgb(255 255 255 / 0.28)',
        }}
      />
      {/* brilho de massinha */}
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{ left: '22%', top: '15%', width: '30%', height: '15%', background: 'rgb(255 255 255 / 0.4)', filter: 'blur(3px)', transform: 'rotate(-30deg)' }}
      />
      <span className="relative flex items-center justify-center">{children}</span>
    </span>
  );
}

type Props = HTMLMotionProps<'button'> & {
  /** Nome para adultos/leitores de tela; a criança só vê o ícone. */
  label: string;
  color: string;
  /** Cor do aro em volta do disco. Padrão: uma versão clara da cor do botão. */
  rim?: string;
  size?: number;
};

// Botão de biscoito. Mínimo de 80 px reais para dedos pequenos.
export function BigButton({ label, color, rim, size = 110, style, children, ...rest }: Props) {
  // Alvo de toque de pelo menos 80 px reais, mesmo em celulares pequenos (onde o palco é reduzido).
  const { scale } = useStage();
  const s = Math.max(80 / scale, size);
  return (
    <motion.button
      type="button"
      aria-label={label}
      className="relative cursor-pointer rounded-full border-0 bg-transparent p-0 outline-none"
      style={{ width: s, height: s, ...style }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9, scaleY: 0.84 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      {...rest}
    >
      <Disc size={s} color={color} rim={rim}>
        {children as ReactNode}
      </Disc>
    </motion.button>
  );
}
