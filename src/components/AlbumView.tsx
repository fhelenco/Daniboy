import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../game/GameContext';
import { hasSticker } from '../game/album';
import { environments } from '../data/environments';
import type { Animal, Environment } from '../data/types';
import { narrate, stopNarration } from '../audio/narrator';
import { LINES } from '../audio/lines';
import { AnimalArt } from '../art/animals';
import { ClayImage } from './ClayImage';
import { ScenePreview } from './Scene';
import { BigButton, clayGradient } from './BigButton';
import { AlbumIcon, BackIcon } from './icons';
import { useStage } from './Stage';

const STICKER = 190;
/** Inclinação de cada figurinha, como se tivesse sido colada à mão. */
const TILTS = [-4, 3, -2, 4, -3];

function Sticker({ animal, found, tilt, onTap }: { animal: Animal; found: boolean; tilt: number; onTap: () => void }) {
  const [taps, setTaps] = useState(0);
  return (
    <button
      type="button"
      aria-label={found ? animal.name : 'Figurinha escondida'}
      className="relative shrink-0 cursor-pointer border-0 bg-transparent p-0 outline-none"
      style={{ width: STICKER, height: STICKER }}
      onClick={() => {
        setTaps((t) => t + 1);
        onTap();
      }}
    >
      <motion.div
        key={taps}
        className="absolute inset-0"
        initial={{ rotate: tilt }}
        animate={taps ? { rotate: [tilt, tilt - 9, tilt + 9, tilt], y: [0, -26, 0], scale: [1, 1.08, 1] } : { rotate: tilt }}
        transition={{ duration: 0.55 }}
      >
        {found ? (
          <div className="clay absolute inset-0 rounded-[36px] border-[7px] border-white bg-[#fff6e3] p-2">
            <AnimalArt animal={animal} />
          </div>
        ) : (
          <div className="absolute inset-0 rounded-[36px] border-[6px] border-dashed border-[#d6b98f] bg-[#f5e4c6]">
            <div className="absolute inset-4" style={{ filter: 'brightness(0)', opacity: 0.14 }}>
              <AnimalArt animal={animal} />
            </div>
            <span
              className="absolute inset-0 flex items-center justify-center text-[110px] leading-none text-white"
              style={{ WebkitTextStroke: '10px #c9a577', paintOrder: 'stroke fill' }}
            >
              ?
            </span>
          </div>
        )}
      </motion.div>
    </button>
  );
}

function PlaceBadge({ env }: { env: Environment }) {
  const [taps, setTaps] = useState(0);
  return (
    <motion.button
      key={taps}
      type="button"
      aria-label={env.name}
      className="clay relative shrink-0 cursor-pointer overflow-hidden rounded-full border-[7px] border-white p-0"
      style={{ width: 150, height: 150, background: env.bgColor }}
      animate={taps ? { scale: [1, 1.12, 1] } : {}}
      onClick={() => {
        setTaps((t) => t + 1);
        void narrate({ text: env.name, audio: env.nameAudio });
      }}
    >
      <ClayImage src={env.cover} alt={env.name} className="absolute inset-0 h-full w-full object-cover" fallback={<ScenePreview env={env} height={136} width={136} />} />
    </motion.button>
  );
}

// Álbum de figurinhas: uma linha por lugar. Encontradas aparecem coloridas; as outras, silhueta com "?".
export function AlbumView({ onClose }: { onClose: () => void }) {
  const { state } = useGame();
  const { w, h } = useStage();

  useEffect(() => {
    void narrate(LINES.album);
    return () => stopNarration();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="absolute inset-0 z-40"
      style={{ background: 'rgb(40 25 10 / 0.5)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <motion.div
        className="clay absolute rounded-[56px] border-[12px] border-[#c79a66]"
        style={{ left: (w - 1480) / 2, top: (h - 820) / 2, width: 1480, height: 820, background: 'radial-gradient(circle at 30% 20%, #fffaf0, #fbe8c6)' }}
        initial={{ scale: 0.6, y: 120 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.25 } }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      >
        <div
          className="clay absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full"
          style={{ top: -30, width: 130, height: 130, background: clayGradient('#9b6ee8') }}
        >
          <AlbumIcon size={84} />
        </div>

        <div className="absolute inset-x-0 flex flex-col items-center gap-6" style={{ top: 120 }}>
          {environments.map((env) => (
            <div key={env.id} className="flex items-center gap-8">
              <PlaceBadge env={env} />
              {env.animals.map((a, i) => {
                const found = hasSticker(state.album, env.id, a.id);
                return (
                  <Sticker
                    key={a.id}
                    animal={a}
                    found={found}
                    tilt={TILTS[i % TILTS.length]}
                    onTap={() => void narrate(found ? { text: a.narration, audio: a.audio } : LINES.albumMissing)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="absolute" style={{ left: 30, top: 30 }}>
        <BigButton label="Voltar" color="#f2a541" size={110} onClick={onClose}>
          <BackIcon size={70} />
        </BigButton>
      </div>
    </motion.div>
  );
}
