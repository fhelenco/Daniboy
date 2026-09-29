import { motion, type TargetAndTransition, type Transition } from 'motion/react';
import { C, Line, S, Shadow, Sheen } from '../art/Clay';
import { ell, leafPath, rrect } from '../art/geom';

export type DaniboyPose = 'idle' | 'wave' | 'walk' | 'laugh';

// Daniboy em massinha: cabelo dourado em mechas, olhos azuis, blusa verde-sálvia,
// jeans com barra dobrada e sapatos marrons. viewBox 260×380, pés em y≈368.
export const DANIBOY_VIEWBOX = { w: 260, h: 380, feet: 368 };

const CYCLE = 1; // um ciclo de caminhada (dois passos), em segundos
const loop = (duration: number): Transition => ({ duration, repeat: Infinity, ease: 'easeInOut' });

type Strand = readonly [x: number, y: number, rot: number, len: number];
// Mechas: [x, y, rotação (0 = para cima), comprimento]
const HAIR_TOP: Strand[] = [
  [66, 96, -128, 42], [70, 70, -98, 44], [90, 48, -64, 44], [116, 36, -30, 40],
  [146, 34, 42, 42], [172, 46, 74, 44], [192, 70, 102, 44], [198, 96, 130, 40],
  [130, 28, 12, 24],
];
const HAIR_SIDES: Strand[] = [
  [62, 108, 200, 40], [66, 122, 190, 30], [198, 108, 160, 40], [196, 122, 170, 30],
];
const HAIR_FRINGE: Strand[] = [
  [86, 64, 196, 34], [104, 58, 182, 38], [124, 56, 168, 40], [144, 58, 158, 38], [164, 62, 148, 36], [182, 72, 138, 32],
];

function Strands({ list, offset = 0 }: { list: Strand[]; offset?: number }) {
  return (
    <>
      {list.map(([x, y, rot, len], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <C d={leafPath(len, len * 0.44)} c={(i + offset) % 2 ? 'hairLight' : 'hair'} />
          <Line d={`M0 ${-len * 0.18}L0 ${-len * 0.78}`} color="rgb(140 95 35 / 0.35)" w={2.5} />
        </g>
      ))}
    </>
  );
}

function Hand({ x, y, open }: { x: number; y: number; open: boolean }) {
  if (!open) {
    return (
      <>
        <C d={ell(x, y, 13, 14)} c="skin" />
        <C d={ell(x + 9, y - 4, 5, 8)} c="skin" />
      </>
    );
  }
  return (
    <g>
      {[-27, -9, 9, 27].map((a) => (
        <C key={a} d={rrect(-4, 0, 8, 20, 4)} c="skin" t={`translate(${x} ${y + 6}) rotate(${a})`} />
      ))}
      <C d={rrect(-4, 0, 8, 16, 4)} c="skin" t={`translate(${x + 10} ${y - 2}) rotate(-70)`} />
      <C d={ell(x, y, 14, 14)} c="skin" />
    </g>
  );
}

function Arm({ x, open, animate, transition }: { x: number; open: boolean; animate: TargetAndTransition; transition: Transition }) {
  return (
    <motion.g style={{ originX: 0.5, originY: 0.06 }} animate={animate} transition={transition}>
      <C d={rrect(x, 194, 30, 64, 15)} c="shirt" />
      <C d={rrect(x - 2, 248, 34, 16, 8)} c="shirt" />
      <Line d={`M${x} 250Q${x + 15} 255 ${x + 30} 250`} color="rgb(40 70 25 / 0.35)" />
      <Hand x={x + 15} y={276} open={open} />
    </motion.g>
  );
}

function Leg({ x, animate, transition }: { x: number; animate: TargetAndTransition; transition: Transition }) {
  return (
    <motion.g animate={animate} transition={transition}>
      <C d={rrect(x, 244, 34, 86, 14)} c="jeans" />
      <Line d={`M${x + 17} 258L${x + 17} 312`} color="rgb(20 35 80 / 0.18)" w={2} />
      <C d={rrect(x - 3, 318, 40, 20, 9)} c="jeans" />
      <Line d={`M${x - 1} 322Q${x + 17} 327 ${x + 35} 322`} color="rgb(20 35 80 / 0.35)" />
      <C d={ell(x + 17, 352, 27, 15)} c="shoe" />
      <path d={rrect(x - 9, 358, 52, 10, 5)} fill="#5b3a23" />
      <Line d={`M${x + 4} 346Q${x + 17} 340 ${x + 30} 346`} color="rgb(50 25 10 / 0.45)" w={4} />
      <Sheen cx={x + 8} cy={345} rx={9} ry={5} o={0.6} />
    </motion.g>
  );
}

function Eyes({ laughing }: { laughing: boolean }) {
  const eyes = [108, 154];
  if (laughing) {
    return (
      <g>
        {eyes.map((cx) => (
          <path key={cx} d={`M${cx - 13} 120Q${cx} 106 ${cx + 13} 120`} stroke="#5b3522" strokeWidth={5} strokeLinecap="round" fill="none" />
        ))}
      </g>
    );
  }
  return (
    <motion.g
      style={{ originX: 0.5, originY: 0.5 }}
      animate={{ scaleY: [1, 1, 0.1, 1] }}
      transition={{ duration: 4.2, times: [0, 0.93, 0.965, 1], repeat: Infinity }}
    >
      {eyes.map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={118} rx={16} ry={18} fill="#fff" />
          <C d={ell(cx + 2, 120, 11)} c="iris" grain={false} />
          <circle cx={cx + 2} cy={120} r={5.5} fill="#141a2e" />
          <circle cx={cx - 2} cy={114} r={3.8} fill="#fff" />
          <circle cx={cx + 6} cy={125} r={1.8} fill="#fff" />
          <path d={`M${cx - 16} 114Q${cx} 96 ${cx + 16} 114`} stroke="#6b4128" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </motion.g>
  );
}

export function Daniboy({ pose = 'idle', className }: { pose?: DaniboyPose; className?: string }) {
  const walking = pose === 'walk';
  const laughing = pose === 'laugh';

  const body: TargetAndTransition = walking
    ? { y: [0, -7, 0, -7, 0], rotate: [-2.5, 0, 2.5, 0, -2.5], scaleY: [0.97, 1.03, 0.97, 1.03, 0.97], scaleX: [1.02, 0.98, 1.02, 0.98, 1.02] }
    : laughing
      ? { y: [0, -16, 0], rotate: 0, scaleY: [0.94, 1.05, 0.94], scaleX: [1.04, 0.97, 1.04] }
      : pose === 'wave'
        ? { y: [0, -3, 0], rotate: [-1.5, 1.5, -1.5], scaleY: 1, scaleX: 1 }
        : { y: [0, -2, 0], rotate: 0, scaleY: [1, 1.012, 1], scaleX: 1 };
  const bodyT = walking ? loop(CYCLE) : laughing ? loop(0.38) : pose === 'wave' ? loop(1.2) : loop(2.6);

  const legT = walking ? loop(CYCLE) : { duration: 0.2 };
  const armL: TargetAndTransition = walking
    ? { rotate: [20, 2, 20] }
    : laughing ? { rotate: [30, 50, 30] } : pose === 'wave' ? { rotate: [138, 162, 138] } : { rotate: 8 };
  const armR: TargetAndTransition = walking
    ? { rotate: [-2, -20, -2] }
    : laughing ? { rotate: [-30, -50, -30] } : { rotate: -8 };
  const armT = walking ? loop(CYCLE) : laughing ? loop(0.38) : pose === 'wave' ? loop(0.7) : { duration: 0.35 };

  return (
    <svg viewBox="0 0 260 380" className={className} overflow="visible" aria-hidden>
      <motion.g
        style={{ originX: 0.5, originY: 0.5 }}
        animate={walking ? { scaleX: [1, 0.9, 1, 0.9, 1] } : laughing ? { scaleX: [1, 0.8, 1] } : { scaleX: 1 }}
        transition={walking ? loop(CYCLE) : laughing ? loop(0.38) : { duration: 0.3 }}
      >
        <Shadow cx={130} cy={368} rx={80} ry={13} />
      </motion.g>

      <motion.g style={{ originX: 0.5, originY: 1 }} animate={body} transition={bodyT}>
        <Leg x={94} animate={walking ? { y: [0, -12, 0, 0, 0] } : { y: 0 }} transition={legT} />
        <Leg x={132} animate={walking ? { y: [0, 0, 0, -12, 0] } : { y: 0 }} transition={legT} />

        {/* pescoço, blusa, barra e gola */}
        <C d={rrect(117, 170, 26, 26, 10)} c="skin" />
        <C d="M76 262C70 236 72 206 90 196C104 188 118 186 130 186C142 186 156 188 170 196C188 206 190 236 184 262C160 272 100 272 76 262Z" c="shirt" />
        <C d="M76 256C100 266 160 266 184 256L185 268C160 280 100 280 75 268Z" c="shirt" />
        <Line d="M76 257C100 267 160 267 184 257" color="rgb(40 70 25 / 0.35)" />
        <S d="M112 190Q130 202 148 190" c="shirt" w={9} />

        <Arm x={70} open={pose === 'wave'} animate={armL} transition={armT} />
        <Arm x={160} open={false} animate={armR} transition={armT} />

        {/* cabeça */}
        <motion.g
          style={{ originX: 0.5, originY: 1 }}
          animate={laughing ? { rotate: [-5, 5, -5] } : walking ? { rotate: [-2, 2, -2] } : { rotate: 0 }}
          transition={laughing ? loop(0.38) : walking ? loop(CYCLE) : { duration: 0.3 }}
        >
          <Strands list={HAIR_SIDES} />
          <C d={ell(66, 124, 16, 20)} c="skin" />
          <C d={ell(194, 124, 16, 20)} c="skin" />
          <Line d="M62 116Q56 126 64 134" color="rgb(170 90 60 / 0.4)" />
          <Line d="M198 116Q204 126 196 134" color="rgb(170 90 60 / 0.4)" />
          <C d={ell(130, 118, 64, 60)} c="skin" />

          <ellipse cx={94} cy={146} rx={15} ry={10} fill="#ff8f9a" opacity={0.35} />
          <ellipse cx={168} cy={146} rx={15} ry={10} fill="#ff8f9a" opacity={0.35} />
          <Eyes laughing={laughing} />
          <S d="M92 92Q106 84 122 90" c="#a8683f" w={7} />
          <S d="M140 88Q154 82 170 90" c="#a8683f" w={7} />
          <C d={ell(131, 138, 10, 8.5)} c="nose" />
          <Sheen cx={128} cy={134} rx={4} ry={3} />

          {laughing ? (
            <g>
              <path d="M106 148C112 186 150 186 156 146C140 157 122 157 106 148Z" fill="#8c3b2c" />
              <path d="M110 151C124 158 140 157 152 150L151 156C140 162 123 162 111 158Z" fill="#fff" />
              <ellipse cx={131} cy={172} rx={12} ry={6} fill="#f26f7e" />
            </g>
          ) : (
            <g>
              <path d="M108 150C114 176 148 176 154 148C140 156 122 156 108 150Z" fill="#8c3b2c" />
              <path d="M112 153C124 158 140 157 150 152L149 157C139 161 123 161 113 158Z" fill="#fff" />
              <ellipse cx={131} cy={166} rx={10} ry={5} fill="#f26f7e" />
            </g>
          )}

          {/* cabelo de massinha */}
          <C d="M58 130C44 64 82 20 132 20C184 20 216 62 202 130C194 100 182 86 168 80C148 72 112 72 92 80C76 88 66 104 58 130Z" c="hair" />
          <Strands list={HAIR_TOP} />
          <Strands list={HAIR_FRINGE} offset={1} />
        </motion.g>
      </motion.g>
    </svg>
  );
}
