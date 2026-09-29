import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useGame } from '../game/GameContext';
import { environments } from '../data/environments';
import type { Environment } from '../data/types';
import { narrate } from '../audio/narrator';
import { LINES } from '../audio/lines';
import { ClayImage } from '../components/ClayImage';
import { BigButton } from '../components/BigButton';
import { AlbumIcon, HomeIcon } from '../components/icons';
import { AlbumView } from '../components/AlbumView';
import { ScenePreview } from '../components/Scene';
import { DaniboyFigure } from '../components/DaniboyFigure';
import { PlacesBackdrop } from '../components/PlacesBackdrop';
import { DESIGN_W, Frame, useStage } from '../components/Stage';

const GAP = 40;
/** Cada placa levemente torta, como se tivesse sido fincada à mão. */
const TILTS = [-2, 1.5, -1.5, 2];

export function PlaceSelectScreen() {
  const { dispatch } = useGame();
  const [chosen, setChosen] = useState<string | null>(null);
  const [albumOpen, setAlbumOpen] = useState(false);
  const n = environments.length;
  const { scale } = useStage();
  // Em celulares os botões do topo ficam maiores (alvo de toque): os cards descem e encolhem um pouco.
  const btn = Math.max(96, 80 / scale);
  const CARD_TOP = Math.max(170, 32 + btn + 12);
  const cardW = Math.min(scale < 0.6 ? 400 : 460, (1480 - GAP * (n - 1)) / n);
  const cardH = cardW * 0.9;
  const startX = (DESIGN_W - (n * cardW + (n - 1) * GAP)) / 2;
  const spots = environments.map((_, i) => ({ x: startX + i * (cardW + GAP), width: cardW, bottom: CARD_TOP + cardH }));

  useEffect(() => void narrate(LINES.choosePlace), []);

  const choose = (env: Environment) => {
    if (chosen) return;
    setChosen(env.id);
    void narrate({ text: env.name, audio: env.nameAudio });
    setTimeout(() => dispatch({ type: 'PICK_ENV', id: env.id }), 1300);
  };

  return (
    <div className="absolute inset-0">
      <PlacesBackdrop cards={spots} />

      <div className="absolute left-8 top-8 z-10 flex gap-6">
        <BigButton label="Início" color="#f2a541" size={96} onClick={() => dispatch({ type: 'GO', screen: 'start' })}>
          <HomeIcon size={60} />
        </BigButton>
        <BigButton label="Álbum" color="#9b6ee8" size={96} onClick={() => setAlbumOpen(true)}>
          <AlbumIcon size={64} />
        </BigButton>
      </div>

      <Frame>
        {environments.map((env, i) => (
          <motion.button
            key={env.id}
            type="button"
            aria-label={env.name}
            onClick={() => choose(env)}
            className="clay absolute cursor-pointer overflow-hidden rounded-[48px] border-[10px] border-white p-0"
            style={{ left: spots[i].x, top: CARD_TOP, width: cardW, height: cardH, background: env.bgColor }}
            initial={{ y: 80, opacity: 0, rotate: TILTS[i % TILTS.length] }}
            animate={
              chosen === env.id
                ? { y: [0, -40, 0], scale: [1, 1.08, 1.04], opacity: 1, rotate: 0 }
                : { y: 0, opacity: chosen ? 0.4 : 1, rotate: TILTS[i % TILTS.length] }
            }
            transition={{ delay: chosen ? 0 : 0.12 * i, type: 'spring', stiffness: 260, damping: 16 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            <ClayImage
              src={env.cover}
              alt={env.name}
              className="absolute inset-0 h-full w-full object-cover"
              fallback={<ScenePreview env={env} height={cardH - 20} width={cardW - 20} />}
            />
            <span
              className="absolute inset-x-0 bottom-2 text-center text-[54px] leading-tight text-white"
              style={{ WebkitTextStroke: '10px rgb(60 40 20 / 0.55)', paintOrder: 'stroke fill' }}
            >
              {env.name}
            </span>
          </motion.button>
        ))}

        {/* Daniboy acenando embaixo da placa da floresta */}
        <div className="absolute" style={{ left: spots[0].x + cardW / 2 - 95, top: 612, width: 190, height: 278 }}>
          <DaniboyFigure pose="wave" className="h-full w-full" />
        </div>
      </Frame>
      <AnimatePresence>{albumOpen && <AlbumView key="album" onClose={() => setAlbumOpen(false)} />}</AnimatePresence>
    </div>
  );
}
