import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../game/GameContext';
import { environments } from '../data/environments';
import { narrate, needsUserGesture } from '../audio/narrator';
import { LINES } from '../audio/lines';
import { DaniboyFigure, type FigurePose } from '../components/DaniboyFigure';
import { BigButton } from '../components/BigButton';
import { PlayIcon } from '../components/icons';
import { WoodSign } from '../components/wood';
import { ScenePreview } from '../components/Scene';
import { Frame } from '../components/Stage';

const TITLE = [
  ['D', '#ff8a3d'],
  ['a', '#4cbf5e'],
  ['n', '#3a8fe0'],
  ['i', '#f2c230'],
  ['b', '#ff6f91'],
  ['o', '#8d6fe8'],
  ['y', '#2fbfb0'],
] as const;

export function StartScreen() {
  const { dispatch } = useGame();
  const [pose, setPose] = useState<FigurePose>('wave');

  // Boas-vindas. O navegador só deixa tocar som depois do primeiro toque;
  // se ainda não houve toque, a fala espera o primeiro toque em qualquer lugar.
  useEffect(() => {
    if (!needsUserGesture()) {
      void narrate(LINES.welcome);
      return;
    }
    const onFirstTouch = () => void narrate(LINES.welcome);
    window.addEventListener('pointerdown', onFirstTouch, { once: true, capture: true });
    return () => window.removeEventListener('pointerdown', onFirstTouch, { capture: true });
  }, []);

  const tickle = () => {
    setPose('laugh');
    void narrate(LINES.welcome);
    setTimeout(() => setPose('wave'), 1400);
  };

  return (
    <div className="absolute inset-0">
      <ScenePreview env={environments[0]} />
      <Frame>

      <div className="absolute inset-x-0 top-10 flex justify-center gap-1" aria-hidden>
        {TITLE.map(([ch, color], i) => (
          <motion.span
            key={i}
            className="text-[150px] leading-none"
            style={{
              color,
              WebkitTextStroke: '14px #fff',
              paintOrder: 'stroke fill',
              textShadow: '0 8px 0 rgb(0 0 0 / 0.12), 0 16px 24px rgb(60 30 0 / 0.25)',
            }}
            initial={{ y: -220, rotate: -20 }}
            animate={{ y: [0, -10, 0], rotate: 0 }}
            transition={{
              y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 + i * 0.12 },
              rotate: { type: 'spring', stiffness: 200, damping: 10, delay: i * 0.08 },
              default: { type: 'spring', stiffness: 200, damping: 10, delay: i * 0.08 },
            }}
          >
            {ch}
          </motion.span>
        ))}
      </div>

      <motion.button
        type="button"
        aria-label="Daniboy"
        onClick={tickle}
        className="absolute cursor-pointer border-0 bg-transparent p-0"
        style={{ left: 520, top: 330, width: 340, height: 497 }}
        initial={{ y: 700 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      >
        <DaniboyFigure pose={pose} className="h-full w-full" />
      </motion.button>

      {/* placa de madeira fincada no chão, com o botão de jogar */}
      <motion.div
        className="absolute"
        style={{ left: 930, top: 360 }}
        initial={{ scale: 0, y: 80, rotate: -3 }}
        animate={{ scale: 1, y: 0, rotate: -2 }}
        transition={{ type: 'spring', stiffness: 160, damping: 13, delay: 0.5 }}
      >
        <WoodSign w={400} h={310} post={140}>
          <motion.div
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          >
            <BigButton label="Jogar" color="#f7952a" rim="#ffd66b" size={220} onClick={() => dispatch({ type: 'GO', screen: 'places' })}>
              <PlayIcon size={140} />
            </BigButton>
          </motion.div>
        </WoodSign>
      </motion.div>
      </Frame>
    </div>
  );
}
