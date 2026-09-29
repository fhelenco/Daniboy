import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue, type TargetAndTransition, type Transition } from 'motion/react';
import { daniboyBackCycle, daniboyCheerCycle, daniboyImages, daniboyWalkCycle, WALK_PX_PER_FRAME } from '../data/daniboy';
import { assetOk } from '../assets/preload';
import { Shadow } from '../art/Clay';
import { Daniboy, type DaniboyPose } from './Daniboy';

/** point = agachado olhando o bicho · lean = inclinado, curioso · back = de costas indo embora · cheer = dançando de alegria. */
export type FigurePose = DaniboyPose | 'point' | 'lean' | 'back' | 'cheer';

/** Quanto o corpo sobe a cada passo enquanto anda, em px do palco. */
const WALK_BOB_PX = 6;

const loop = (duration: number): Transition => ({ duration, repeat: Infinity, ease: 'easeInOut' });

// Movimento do corpo inteiro por cima das imagens (as poses vêm prontas no desenho).
const MOVES: Record<FigurePose, [TargetAndTransition, Transition]> = {
  // só com uma imagem de caminhada: um balanço leve para dar vida
  walk: [{ y: [0, -8, 0], rotate: 0, scaleY: [0.98, 1.02, 0.98] }, loop(0.45)],
  laugh: [{ y: [0, -18, 0], rotate: 0, scaleY: [0.95, 1.04, 0.95] }, loop(0.45)],
  cheer: [{ y: [0, -12, 0], rotate: [-2, 2, -2], scaleY: [0.97, 1.03, 0.97] }, loop(0.5)],
  wave: [{ y: [0, -5, 0], rotate: [-1.5, 1.5, -1.5], scaleY: 1 }, loop(2.2)],
  idle: [{ y: 0, rotate: 0, scaleY: [1, 1.012, 1] }, loop(2.6)],
  point: [{ y: [0, -3, 0], rotate: 0, scaleY: [1, 1.015, 1] }, loop(1.8)],
  lean: [{ y: [0, -3, 0], rotate: [0, 1, 0], scaleY: 1 }, loop(1.2)],
  back: [{ y: [0, -8, 0], rotate: [-2, 2, -2], scaleY: 1 }, loop(0.4)],
};
// Com os quadros da caminhada, as pernas e o corpo já se mexem no desenho: nada por cima.
const STILL: [TargetAndTransition, Transition] = [{ y: 0, rotate: 0, scaleY: 1 }, { duration: 0.2 }];

/** Poses feitas de vários quadros: `distance` = pelo chão andado; senão, pelo relógio (`fps`). */
const CYCLES: Partial<Record<FigurePose, { srcs: string[]; fps: number }>> = {
  walk: { srcs: daniboyWalkCycle, fps: 12 },
  back: { srcs: daniboyBackCycle, fps: 5 },
  cheer: { srcs: daniboyCheerCycle, fps: 4 },
};

function imageFor(pose: FigurePose) {
  const want = {
    walk: daniboyImages.walk,
    idle: daniboyImages.walk,
    point: daniboyImages.point,
    lean: daniboyImages.lean,
    back: daniboyImages.back,
    wave: daniboyImages.wave,
    laugh: daniboyImages.jump,
    cheer: daniboyImages.fist,
  }[pose];
  return assetOk(want) ? want : assetOk(daniboyImages.wave) ? daniboyImages.wave : null;
}

/**
 * Quanto ele já andou, somando a distância nas duas direções: os passos avançam sempre para
 * "frente" da animação, mesmo quando ele volta (aí a imagem só é espelhada).
 */
function useStepPhase(distance?: MotionValue<number>) {
  const phase = useMotionValue(0);
  const none = useMotionValue(0);
  const last = useRef<number | null>(null);
  useEffect(() => {
    last.current = distance ? distance.get() : null;
  }, [distance]);
  useMotionValueEvent(distance ?? none, 'change', (v) => {
    if (!distance) return;
    if (last.current !== null) phase.set(phase.get() + Math.abs(v - last.current));
    last.current = v;
  });
  return phase;
}

/** Índice do quadro: pela distância andada (pés acompanham o chão) ou pelo relógio. */
function useCycleFrame(count: number, fps: number, phase: MotionValue<number>, byDistance: boolean) {
  const [i, setI] = useState(0);
  useMotionValueEvent(phase, 'change', (v) => {
    if (byDistance && count > 1) setI(Math.floor(v / WALK_PX_PER_FRAME) % count);
  });
  useEffect(() => {
    if (byDistance || count < 2) return;
    setI(0);
    const t = setInterval(() => setI((v) => (v + 1) % count), 1000 / fps);
    return () => clearInterval(t);
  }, [count, fps, byDistance]);
  return count > 0 ? i % count : 0;
}

/**
 * O Daniboy: usa as imagens de public/assets/daniboy se existirem; senão, o desenho em SVG.
 * `distance`: quanto ele já andou (na trilha), para os passos acompanharem o chão.
 */
export function DaniboyFigure({
  pose,
  className,
  distance,
  facing = 1,
}: {
  pose: FigurePose;
  className?: string;
  distance?: MotionValue<number>;
  /** 1 = olhando para a direita, -1 = para a esquerda (imagem espelhada). */
  facing?: 1 | -1;
}) {
  const cycle = CYCLES[pose];
  const frames = cycle && cycle.srcs.every(assetOk) ? cycle.srcs : null;
  const phase = useStepPhase(distance);
  const byDistance = pose === 'walk' && !!distance;
  const frame = useCycleFrame(frames?.length ?? 0, cycle?.fps ?? 1, phase, byDistance);
  const src = imageFor(pose);

  // Balanço do corpo: sobe quando as pernas se cruzam (início do ciclo) e desce nas pisadas abertas (meio).
  const bob = useTransform(phase, (v) => {
    const t = (v / (WALK_PX_PER_FRAME * daniboyWalkCycle.length)) % 1;
    return -(0.5 + 0.5 * Math.cos(2 * Math.PI * (t - 0.05))) * WALK_BOB_PX;
  });
  const mirror = facing === -1 ? { transform: 'scaleX(-1)' } : undefined;

  if (!src && !frames) {
    const svgPose: DaniboyPose = pose === 'cheer' ? 'laugh' : pose === 'point' || pose === 'lean' || pose === 'back' ? 'idle' : pose;
    return <Daniboy pose={svgPose} className={className} />;
  }

  const [animate, transition] = frames && pose === 'walk' ? STILL : MOVES[pose];
  const img = 'absolute inset-0 h-full w-full object-contain object-bottom';
  return (
    <div className={`relative ${className ?? ''}`}>
      <svg viewBox="0 0 260 380" className="absolute inset-0 h-full w-full" overflow="visible" aria-hidden>
        <Shadow cx={130} cy={368} rx={pose === 'cheer' || pose === 'laugh' ? 60 : 80} ry={13} />
      </svg>
      <motion.div className="absolute inset-0" style={{ originX: 0.5, originY: 1 }} animate={animate} transition={transition}>
        {frames ? (
          // todos os quadros ficam montados; só um aparece (troca sem piscar)
          <motion.div className="absolute inset-0" style={pose === 'walk' && distance ? { y: bob } : undefined}>
            <div className="absolute inset-0" style={mirror}>
              {frames.map((f, k) => (
                <img key={k} src={f} alt="" draggable={false} className={img} style={{ visibility: k === frame ? 'visible' : 'hidden' }} />
              ))}
            </div>
          </motion.div>
        ) : (
          <img src={src!} alt="" draggable={false} className={img} style={mirror} />
        )}
      </motion.div>
    </div>
  );
}
