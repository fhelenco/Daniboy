import { useCallback, useEffect, useReducer, useRef, useState, type PointerEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react';
import { useGame } from '../game/GameContext';
import { environments, findEnvironment } from '../data/environments';
import type { Animal, Environment } from '../data/types';
import { usePreload } from '../assets/preload';
import { narrate } from '../audio/narrator';
import { LINES } from '../audio/lines';
import { initialTrail, trailReducer } from '../game/trail';
import { useWalkLoop } from '../game/useWalkLoop';
import { SceneBack, SceneFront } from '../components/Scene';
import { DaniboyFigure, type FigurePose } from '../components/DaniboyFigure';
import { GROUND_Y, TrailAnimal } from '../components/TrailAnimal';
import { TapBurst, type Burst } from '../components/TapBurst';
import { WalkButton } from '../components/WalkButton';
import { BigButton } from '../components/BigButton';
import { AlbumIcon, HomeIcon } from '../components/icons';
import { AnimalCard, useCardGeometry } from '../components/AnimalCard';
import { StarBurst, StickerFly } from '../components/StickerFly';
import { AlbumView } from '../components/AlbumView';
import { Confetti } from '../components/Confetti';
import { hasSticker } from '../game/album';
import { STAGE_H, useStage } from '../components/Stage';
import { LoadingScreen } from './LoadingScreen';

/** Onde o Daniboy fica na tela (a câmera acompanha ele). */
const DANI_X = 430;
const KEYS_RIGHT = ['ArrowRight', ' ', 'Enter'];
const KEYS_LEFT = ['ArrowLeft'];

export function TrailScreen() {
  const { state } = useGame();
  const env = findEnvironment(state.environmentId) ?? environments[0];
  const { progress, ready } = usePreload(env);

  return (
    <AnimatePresence mode="wait">
      {ready ? (
        <motion.div key="trail" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Trail env={env} />
        </motion.div>
      ) : (
        <motion.div key="loading" className="absolute inset-0" exit={{ opacity: 0 }}>
          <LoadingScreen env={env} progress={progress} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Trail({ env }: { env: Environment }) {
  const { state: gameState, dispatch: game } = useGame();
  const { w, extra, scale } = useStage();
  const card = useCardGeometry();
  // Centro do botão do álbum (destino da figurinha): canto de cima, à direita da casinha.
  const btn = Math.max(96, 80 / scale);
  const ALBUM_CENTER = { x: 32 + btn + 24 + btn / 2, y: 32 + btn / 2 };
  const [s, dispatch] = useReducer(trailReducer, initialTrail);
  const worldX = useMotionValue(0);
  const worldShift = useTransform(worldX, (v) => DANI_X - v);
  const [laughing, setLaughing] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const laughTimer = useRef(0);

  const moving = useWalkLoop(env, s, dispatch, worldX);

  // Para que lado ele está olhando: o último lado para onde andou.
  const [facing, setFacing] = useState<1 | -1>(1);
  useEffect(() => {
    if (s.dir !== 0) setFacing(s.dir);
  }, [s.dir]);

  const laugh = useCallback((ms: number) => {
    setLaughing(true);
    window.clearTimeout(laughTimer.current);
    laughTimer.current = window.setTimeout(() => setLaughing(false), ms);
  }, []);
  useEffect(() => () => window.clearTimeout(laughTimer.current), []);

  // Teclado (para testar no computador) e segurança: nunca andar sozinho.
  useEffect(() => {
    const dirOf = (key: string): 0 | 1 | -1 => (KEYS_RIGHT.includes(key) ? 1 : KEYS_LEFT.includes(key) ? -1 : 0);
    const down = (e: KeyboardEvent) => {
      const dir = dirOf(e.key);
      if (!dir) return;
      e.preventDefault();
      if (!e.repeat) dispatch({ type: 'HOLD', dir });
    };
    const up = (e: KeyboardEvent) => {
      const dir = dirOf(e.key);
      if (!dir) return;
      e.preventDefault();
      // soltar uma tecla só para se ele ainda estiver andando para o lado dela
      dispatch({ type: 'HOLD', dir: 0, only: dir });
    };
    const stop = () => dispatch({ type: 'HOLD', dir: 0 });
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', stop);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', stop);
      document.removeEventListener('visibilitychange', stop);
    };
  }, []);

  // Ao chegar num bicho, ele primeiro se inclina curioso e só depois agacha.
  const [crouched, setCrouched] = useState(false);
  useEffect(() => {
    setCrouched(false);
    if (!s.encounter) return;
    const t = setTimeout(() => setCrouched(true), 450);
    return () => clearTimeout(t);
  }, [s.encounter]);

  // Fim da trilha: festa, ele vai embora de costas pela trilha e volta acenando.
  const [finale, setFinale] = useState<'none' | 'party' | 'leaving' | 'back'>('none');
  useEffect(() => {
    if (!s.finished) return;
    setFinale('party');
    void narrate(LINES.allFound);
    const t1 = setTimeout(() => setFinale('leaving'), 2600);
    const t2 = setTimeout(() => setFinale('back'), 2600 + 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [s.finished]);

  // Tocar num bicho abre o card; se for a primeira vez, ele entra no álbum.
  const meet = (a: Animal) => {
    if (s.card) return;
    dispatch({ type: 'OPEN_CARD', id: a.id, isNew: !hasSticker(gameState.album, env.id, a.id) });
    game({ type: 'COLLECT', envId: env.id, animalId: a.id });
  };
  const closeCard = useCallback(() => dispatch({ type: 'CLOSE_CARD' }), []);
  const closeAlbum = useCallback(() => dispatch({ type: 'ALBUM', open: false }), []);
  const cardAnimal = env.animals.find((a) => a.id === s.card);
  const stickerAnimal = env.animals.find((a) => a.id === s.sticker);

  // Figurinha chegou: o álbum pula e solta estrelinhas.
  const [albumPulse, setAlbumPulse] = useState(0);
  const stickerArrived = useCallback(() => {
    dispatch({ type: 'STICKER_DONE' });
    setAlbumPulse((p) => p + 1);
  }, []);

  const tapEmpty = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const k = r.width / w;
    const b = { id: performance.now(), x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
    setBursts((list) => [...list.slice(-5), b]);
    setTimeout(() => setBursts((list) => list.filter((it) => it.id !== b.id)), 1800);
    if (s.dir === 0) laugh(900);
  };

  const pose: FigurePose =
    finale === 'party' ? 'cheer'
    : finale === 'leaving' ? 'back'
    : finale === 'back' ? (laughing ? 'laugh' : 'wave')
    : laughing ? 'laugh'
    : moving ? 'walk'
    : s.encounter ? (crouched ? 'point' : 'lean')
    : 'idle';

  return (
    <div className="absolute inset-0 overflow-clip" onPointerDown={tapEmpty}>
      <SceneBack env={env} worldX={worldX} />

      {/* o mundo (bichos e Daniboy) fica no quadro de 900 de altura, ancorado embaixo */}
      <div className="pointer-events-none absolute left-0" style={{ top: extra, width: w, height: STAGE_H }}>
      <motion.div className="pointer-events-none absolute left-0 top-0" style={{ x: worldShift }}>
        {env.animals.map((a) => (
          <TrailAnimal
            key={a.id}
            animal={a}
            calling={s.encounter === a.id}
            onTap={() => meet(a)}
          />
        ))}
      </motion.div>

      <motion.button
        key={finale === 'back' ? 'voltou' : 'daniboy'}
        type="button"
        aria-label="Daniboy"
        className="absolute cursor-pointer border-0 bg-transparent p-0 outline-none"
        style={{ left: DANI_X - 130, top: GROUND_Y - 368, width: 260, height: 380, originX: 0.5, originY: 1 }}
        initial={finale === 'back' ? { opacity: 0, scale: 0.6 } : false}
        animate={
          finale === 'leaving'
            ? { x: 230, y: -310, scale: 0.26, opacity: [1, 1, 0] }
            : { x: 0, y: 0, scale: 1, opacity: 1 }
        }
        transition={finale === 'leaving' ? { duration: 3.2, ease: 'easeIn' } : { type: 'spring', stiffness: 200, damping: 14 }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => finale !== 'leaving' && laugh(1200)}
      >
        <DaniboyFigure pose={pose} className="h-full w-full" distance={worldX} facing={facing} />
      </motion.button>
      </div>

      <SceneFront env={env} worldX={worldX} />

      {bursts.map((b) => (
        <TapBurst key={b.id} {...b} kind={env.tapEffect ?? 'leaves'} />
      ))}

      <div className="absolute left-8 top-8 flex gap-6" onPointerDown={(e) => e.stopPropagation()}>
        <BigButton label="Escolher lugar" color="#f2a541" size={96} onClick={() => game({ type: 'GO', screen: 'places' })}>
          <HomeIcon size={60} />
        </BigButton>
        <motion.div
          key={albumPulse}
          animate={albumPulse ? { scale: [1, 1.35, 0.9, 1.1, 1], rotate: [0, -10, 8, 0] } : {}}
          transition={{ duration: 0.7 }}
        >
          <BigButton label="Álbum" color="#9b6ee8" size={96} onClick={() => dispatch({ type: 'ALBUM', open: true })}>
            <AlbumIcon size={64} />
          </BigButton>
        </motion.div>
      </div>
      {albumPulse > 0 && <StarBurst key={albumPulse} {...ALBUM_CENTER} />}

      {finale !== 'none' && <Confetti />}

      {finale === 'back' ? (
        <div className="absolute flex items-center gap-10" style={{ right: 100, bottom: 80 }} onPointerDown={(e) => e.stopPropagation()}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.3 }}>
            <BigButton label="Escolher outro lugar" color="#4cbf5e" size={150} onClick={() => game({ type: 'GO', screen: 'places' })}>
              <HomeIcon size={92} />
            </BigButton>
          </motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 1.1, 1] }} transition={{ scale: { duration: 1.2, repeat: Infinity, delay: 0.6 } }}>
            <BigButton label="Ver o álbum" color="#9b6ee8" size={200} onClick={() => dispatch({ type: 'ALBUM', open: true })}>
              <AlbumIcon size={130} />
            </BigButton>
          </motion.div>
        </div>
      ) : s.finished ? null : (
        <>
          <WalkButton dir={-1} holding={s.dir === -1} onHold={(on) => dispatch({ type: 'HOLD', dir: on ? -1 : 0, only: -1 })} />
          <WalkButton dir={1} holding={s.dir === 1} onHold={(on) => dispatch({ type: 'HOLD', dir: on ? 1 : 0, only: 1 })} />
        </>
      )}

      <AnimatePresence>
        {cardAnimal && <AnimalCard key={cardAnimal.id} animal={cardAnimal} env={env} onClose={closeCard} />}
      </AnimatePresence>
      <AnimatePresence>{s.album && <AlbumView key="album" onClose={closeAlbum} />}</AnimatePresence>
      {stickerAnimal && (
        <StickerFly key={stickerAnimal.id} animal={stickerAnimal} from={card.artCenter} to={ALBUM_CENTER} onDone={stickerArrived} />
      )}
    </div>
  );
}
