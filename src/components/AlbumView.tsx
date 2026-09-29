import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../game/GameContext';
import { hasSticker } from '../game/album';
import { environments } from '../data/environments';
import type { Animal, Environment } from '../data/types';
import { narrate, stopNarration } from '../audio/narrator';
import { LINES } from '../audio/lines';
import { AnimalArt } from '../art/animals';
import { BigButton, Disc } from './BigButton';
import { BackIcon, CactusIcon, SpeakerIcon, TreeIcon, WaveIcon } from './icons';
import { OpenBook, WoodSign } from './wood';
import { useStage } from './Stage';

const STICKER = 260;
const BOOK_W = 1480;
const BOOK_H = 820;
const PAGE_W = (BOOK_W - 60) / 2;
/** Inclinação de cada figurinha, como se tivesse sido colada à mão. */
const TILTS = [-4, 3, -2, 4, -3];

/** Emblema de cada lugar (mesmas cores da tela de escolher lugar). */
const EMBLEMS: Record<string, { color: string; rim: string; icon: (size: number) => ReactNode }> = {
  floresta: { color: '#3fae4a', rim: '#ffc247', icon: (s) => <TreeIcon size={s} /> },
  deserto: { color: '#f2a541', rim: '#ffd66b', icon: (s) => <CactusIcon size={s} /> },
  oceano: { color: '#3d9be0', rim: '#bfe6ff', icon: (s) => <WaveIcon size={s} /> },
};

function Sticker({ animal, found, tilt, onTap }: { animal: Animal; found: boolean; tilt: number; onTap: () => void }) {
  const [taps, setTaps] = useState(0);
  return (
    <button
      type="button"
      aria-label={found ? animal.name : 'Figurinha escondida'}
      className="relative cursor-pointer border-0 bg-transparent p-0 outline-none"
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
          // figurinha recortada: o próprio bicho com contorno branco, sem cartão atrás
          <div className="diecut absolute -inset-3" style={{ ['--o' as string]: '8px' }}>
            <div className="h-full w-full">
              <AnimalArt animal={animal} />
            </div>
          </div>
        ) : (
          <div className="absolute -inset-3">
            <div className="diecut silhouette absolute inset-0" style={{ ['--o' as string]: '8px' }}>
              <div className="h-full w-full">
                <AnimalArt animal={animal} />
              </div>
            </div>
            <span
              className="absolute inset-0 flex items-center justify-center text-[120px] leading-none text-white"
              style={{ WebkitTextStroke: '14px #b8b1a6', paintOrder: 'stroke fill', textShadow: '0 6px 0 rgb(120 110 100 / 0.35)' }}
            >
              ?
            </span>
          </div>
        )}
      </motion.div>
    </button>
  );
}

/** Estrelinhas de progresso do lugar: douradas as que já foram encontradas, cinzas as que faltam. */
function Stars({ found, total }: { found: number; total: number }) {
  return (
    <div className="flex gap-3">
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} viewBox="0 0 40 40" width={42} height={42} style={{ filter: 'drop-shadow(0 3px 2px rgb(90 50 10 / 0.3))' }}>
          <path
            d="M20 3l5 11.5 12.5 1.2-9.4 8.4 2.8 12.3L20 29.8 9.1 36.4l2.8-12.3L2.5 15.7 15 14.5z"
            fill={i < found ? '#f7bd43' : '#d9d3c8'}
            stroke={i < found ? '#c98a14' : '#b8b1a6'}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

// Álbum de figurinhas: um livro aberto por lugar (três lugares, trocados pelos emblemas em cima).
// Encontradas aparecem coloridas e recortadas; as outras, silhueta cinza com "?".
export function AlbumView({ onClose, initialEnvId }: { onClose: () => void; initialEnvId?: string }) {
  const { state } = useGame();
  const { w, h, scale } = useStage();
  // Marcadores dos lugares: alvo de toque de pelo menos 80 px reais, sem sair da tela por cima do livro.
  const tab = Math.max(124, 80 / scale);
  const bookTop = (h - BOOK_H) / 2 + 30;
  const tabTop = -Math.min(tab * 0.53, bookTop - 8);
  const [envId, setEnvId] = useState(initialEnvId ?? environments[0].id);
  const env: Environment = environments.find((e) => e.id === envId) ?? environments[0];
  const foundCount = env.animals.filter((a) => hasSticker(state.album, env.id, a.id)).length;

  useEffect(() => {
    void narrate(LINES.album);
    return () => stopNarration();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Posições das 6 vagas: 3 na página da esquerda (2 em cima, 1 embaixo) e 2 + emblema na da direita.
  const pageX = (page: 0 | 1) => page * PAGE_W;
  const col = (page: 0 | 1, c: 0 | 1) => pageX(page) + 75 + c * (STICKER + 40);
  const mid = (page: 0 | 1) => pageX(page) + (PAGE_W - STICKER) / 2;
  const slots = [
    { x: col(0, 0), y: 125 },
    { x: col(0, 1), y: 125 },
    { x: mid(0), y: 425 },
    { x: col(1, 0), y: 125 },
    { x: col(1, 1), y: 125 },
  ];
  const badge = env && EMBLEMS[env.id];

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
        className="absolute"
        style={{ left: (w - BOOK_W) / 2, top: bookTop, width: BOOK_W, height: BOOK_H }}
        initial={{ scale: 0.6, y: 120 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.25 } }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      >
        <OpenBook w={BOOK_W} h={BOOK_H}>
          <motion.div key={env.id} className="absolute inset-0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            {env.animals.slice(0, 5).map((a, i) => {
              const found = hasSticker(state.album, env.id, a.id);
              return (
                <div key={a.id} className="absolute" style={{ left: slots[i].x, top: slots[i].y }}>
                  <Sticker
                    animal={a}
                    found={found}
                    tilt={TILTS[i % TILTS.length]}
                    onTap={() => void narrate(found ? { text: a.narration, audio: a.audio } : LINES.albumMissing)}
                  />
                </div>
              );
            })}

            {/* sexta vaga: emblema do lugar e as estrelinhas do progresso */}
            <div className="absolute flex flex-col items-center gap-3" style={{ left: mid(1) - 40, top: 405, width: STICKER + 80 }}>
              <Disc size={130} color={badge?.color ?? '#3fae4a'} rim={badge?.rim}>
                {badge?.icon(76)}
              </Disc>
              <WoodSign w={300} h={76} r={32} seed={4} leaves={false}>
                <span className="text-[48px] leading-none text-[#fff4d6]" style={{ textShadow: '0 4px 0 rgb(80 40 10 / 0.55)' }}>
                  {env.name}
                </span>
              </WoodSign>
              <Stars found={foundCount} total={env.animals.length} />
            </div>
          </motion.div>
        </OpenBook>

        {/* marcadores dos lugares, saindo pela borda de cima do livro */}
        <div className="absolute left-1/2 flex -translate-x-1/2 gap-8" style={{ top: tabTop }}>
          {environments.map((e) => {
            const em = EMBLEMS[e.id];
            const on = e.id === env.id;
            return (
              <motion.button
                key={e.id}
                type="button"
                aria-label={e.name}
                className="cursor-pointer border-0 bg-transparent p-0 outline-none"
                animate={{ scale: on ? 1.15 : 0.92, y: on ? 6 : 0 }}
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                onClick={() => {
                  setEnvId(e.id);
                  void narrate({ text: e.name, audio: e.nameAudio });
                }}
              >
                <Disc size={tab} color={em?.color ?? '#3fae4a'} rim={on ? '#ffc247' : em?.rim}>
                  {em?.icon(tab * 0.58)}
                </Disc>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <div className="absolute flex flex-col gap-6" style={{ left: 30, top: 30 }}>
        <BigButton label="Voltar" color="#f7952a" rim="#ffd66b" size={110} onClick={onClose}>
          <BackIcon size={70} />
        </BigButton>
        <BigButton label="Ouvir de novo" color="#3d9be0" rim="#bfe6ff" size={110} onClick={() => void narrate(LINES.album)}>
          <SpeakerIcon size={70} />
        </BigButton>
      </div>
    </motion.div>
  );
}
