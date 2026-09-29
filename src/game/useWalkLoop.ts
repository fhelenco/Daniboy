import { useEffect, useRef, useState, type Dispatch } from 'react';
import type { MotionValue } from 'motion/react';
import type { Environment } from '../data/types';
import { trailEnd } from '../data/environments';
import type { TrailAction, TrailState } from './trail';

/** Velocidade do Daniboy (px do mundo por segundo). */
export const WALK_SPEED = 330;
/** Distância em que ele para antes de um bicho. */
export const STOP_GAP = 520;
/** Aceleração ao começar a andar e freada ao soltar (px/s²). */
const ACCEL = 1100;
const DECEL = 1400;

// Move o mundo a cada quadro (sem re-render do React): acelera ao segurar, freia ao soltar,
// e desacelera sozinho ao chegar perto de um bicho, do fim da trilha ou do começo dela.
// Anda nas duas direções (dir = 1 para a direita, -1 para a esquerda).
// Devolve `moving`, que fica true enquanto ele estiver se deslocando.
export function useWalkLoop(env: Environment, s: TrailState, dispatch: Dispatch<TrailAction>, worldX: MotionValue<number>) {
  const vel = useRef(0); // px/s, com sinal
  const [moving, setMoving] = useState(false);
  const blocked = s.finished || !!s.card || s.album || (s.dir === 1 && !!s.encounter);
  const active = s.dir !== 0 && !blocked;

  useEffect(() => {
    if (!active && vel.current === 0) return;
    setMoving(true);

    const stops = env.animals
      .filter((a) => !s.met.includes(a.id))
      .map((a) => ({ id: a.id, at: a.x - STOP_GAP }))
      .sort((a, b) => a.at - b.at);
    const end = trailEnd(env);
    const target = active ? s.dir * WALK_SPEED : 0;

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const x0 = worldX.get();

      // acelera em direção à velocidade desejada (freia mais forte que acelera)
      const braking = target === 0 || Math.sign(target) !== Math.sign(vel.current) || Math.abs(target) < Math.abs(vel.current);
      const dv = (braking && vel.current !== 0 ? DECEL : ACCEL) * dt;
      let v = vel.current < target ? Math.min(target, vel.current + dv) : Math.max(target, vel.current - dv);

      // para exatamente no ponto (o +20 garante que ele chega)
      const next = stops.find((st) => st.at >= x0 - 0.5);
      const right = Math.min(next ? next.at : Infinity, end);
      if (v > 0) v = Math.min(v, Math.sqrt(2 * DECEL * Math.max(0, right - x0)) + 20);
      if (v < 0) v = Math.max(v, -(Math.sqrt(2 * DECEL * Math.max(0, x0)) + 20));
      const x = x0 + v * dt;

      if (v > 0 && x >= right) {
        worldX.set(right);
        vel.current = 0;
        setMoving(false);
        if (next && right === next.at) dispatch({ type: 'ARRIVE', id: next.id });
        else dispatch({ type: 'FINISH' });
        return;
      }
      if (v < 0 && x <= 0) {
        worldX.set(0);
        vel.current = 0;
        setMoving(false);
        return;
      }
      worldX.set(x);
      vel.current = v;
      if (!active && v === 0) {
        setMoving(false);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, s.dir, env, s.met, dispatch, worldX]);

  return moving;
}
