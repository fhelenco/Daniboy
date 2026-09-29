import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { Animal, Environment } from '../data/types';
import { narrate, stopNarration } from '../audio/narrator';
import { AnimalArt } from '../art/animals';
import { BigButton } from './BigButton';
import { CloseIcon, SpeakerIcon } from './icons';
import { FramedPanel, Mound, WoodSign } from './wood';
import { useStage } from './Stage';

/** Posição do card no palco (centralizado, qualquer que seja a tela) e de onde sai a figurinha. */
export function useCardGeometry() {
  const { w, h } = useStage();
  const left = (w - 1100) / 2;
  const top = (h - 720) / 2;
  /** Centro do bicho dentro do card, em coordenadas do palco. */
  return { left, top, width: 1100, height: 720, artCenter: { x: left + 50 + 280, y: top + 60 + 300 } };
}

// Card do bicho: imagem grande, nome, narração automática, "ouvir de novo" e fechar.
export function AnimalCard({ animal, env, onClose }: { animal: Animal; env: Environment; onClose: () => void }) {
  const [talking, setTalking] = useState(false);
  const [jumps, setJumps] = useState(0);
  const [nudge, setNudge] = useState(0);
  const speakId = useRef(0);
  const { artCenter: _artCenter, ...cardBox } = useCardGeometry();
  // O botão de fechar cresce em celulares (alvo de toque): o nome desce para não ficar embaixo dele.
  const { scale } = useStage();
  const closeSize = Math.max(120, 80 / scale);

  const speak = useCallback(() => {
    const id = ++speakId.current;
    setTalking(true);
    void narrate({ text: animal.narration, audio: animal.audio }).then(() => {
      if (speakId.current === id) setTalking(false);
    });
  }, [animal]);

  useEffect(() => {
    speak();
    return () => stopNarration();
  }, [speak]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const glow = env.bgColor ?? '#7cc45a';

  return (
    <motion.div
      className="absolute inset-0 z-40"
      style={{ background: 'rgb(40 25 10 / 0.45)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // Toque fora do card: não fecha sem querer, só balança o X para mostrar onde fechar.
      onPointerDown={(e) => {
        e.stopPropagation();
        setNudge((n) => n + 1);
      }}
    >
      <motion.div
        className="absolute"
        style={cardBox}
        initial={{ scale: 0.4, y: 120, rotate: -4 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.3, opacity: 0, transition: { duration: 0.25 } }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* moldura de madeira, papel creme por dentro e folhinhas nos cantos */}
        <FramedPanel w={cardBox.width} h={cardBox.height} frame={30} r={70} />

        {/* montinho de chão do lugar, onde o bicho fica em pé */}
        <Mound
          w={560}
          h={150}
          tone={env.id === 'floresta' ? 'moss' : env.id === 'oceano' ? 'wetSand' : 'sand'}
          tuft={env.id === 'floresta' ? 'leaf' : env.id === 'oceano' ? 'agave' : 'dryGrass'}
          seed={env.id.length + 3}
          className="absolute"
          style={{ position: 'absolute', left: 50, top: 522 }}
        />

        {/* vitrine do bicho: tocar nele repete a narração */}
        <button
          type="button"
          aria-label={animal.name}
          className="absolute cursor-pointer border-0 bg-transparent p-0 outline-none"
          style={{ left: 50, top: 60, width: 560, height: 600 }}
          onClick={() => {
            setJumps((j) => j + 1);
            speak();
          }}
        >
          <div
            className="absolute inset-4 rounded-full"
            style={{ background: `radial-gradient(circle at 50% 45%, #fff 0%, #fff3c9 42%, color-mix(in srgb, ${glow} 30%, #ffe6a8) 60%, transparent 72%)` }}
          />
          <motion.div
            key={jumps}
            className="absolute inset-x-6 bottom-10 top-2"
            style={{ originY: 1 }}
            animate={jumps ? { y: [0, -70, 0], scaleY: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.div
              className="h-full w-full"
              style={{ originY: 1 }}
              animate={talking ? { scaleY: [1, 1.05, 0.97, 1], rotate: [0, -2, 2, 0] } : { scaleY: [1, 1.02, 1], rotate: 0 }}
              transition={talking ? { duration: 0.45, repeat: Infinity } : { duration: 2.4, repeat: Infinity }}
            >
              <AnimalArt animal={animal} />
            </motion.div>
          </motion.div>
        </button>

        {/* nome (para os adultos) e botão de ouvir de novo */}
        <div className="absolute flex flex-col items-center gap-12" style={{ left: 620, top: Math.max(150, 36 + closeSize + 8), width: 420 }}>
          <WoodSign w={440} h={130} r={44} seed={7} leaves={false}>
            <span className="text-[80px] leading-none text-[#fff4d6]" style={{ textShadow: '0 5px 0 rgb(80 40 10 / 0.55), 0 0 12px rgb(60 30 5 / 0.35)' }}>
              {animal.name}
            </span>
          </WoodSign>
          <motion.div
            animate={talking ? { scale: 1 } : { scale: [1, 1.1, 1] }}
            transition={talking ? { duration: 0.2 } : { duration: 1.2, repeat: Infinity }}
          >
            <BigButton label="Ouvir de novo" color="#3d9be0" rim="#bfe6ff" size={190} onClick={speak}>
              <SpeakerIcon size={120} />
            </BigButton>
          </motion.div>
        </div>

        <motion.div
          key={nudge}
          className="absolute"
          style={{ right: -16, top: -16 }}
          animate={nudge ? { rotate: [0, -14, 14, -8, 0], scale: [1, 1.18, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <BigButton label="Fechar" color="#e8443a" rim="#ffb3a8" size={closeSize} onClick={onClose}>
            <CloseIcon size={closeSize * 0.65} />
          </BigButton>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
