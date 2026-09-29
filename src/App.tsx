import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { GameProvider, useGame } from './game/GameContext';
import { environments, findEnvironment } from './data/environments';
import { DANIBOY_FIRST, useAssetsChecked } from './assets/preload';
import { ClayDefs } from './art/ClayDefs';
import { Stage } from './components/Stage';
import { SoundToggle } from './components/SoundToggle';
import { StartScreen } from './screens/StartScreen';
import { PlaceSelectScreen } from './screens/PlaceSelectScreen';
import { TrailScreen } from './screens/TrailScreen';

function Screens() {
  const { state } = useGame();
  // Descobre se as imagens de que as primeiras telas precisam existem (senão, usa o desenho em SVG).
  // O resto do Daniboy carrega junto com a trilha, na tela de carregando.
  useAssetsChecked(DANIBOY_FIRST);
  const env = findEnvironment(state.environmentId) ?? environments[0];
  const bg = state.screen === 'places' ? '#e3be86' : (env.bgColor ?? '#7cc45a');

  return (
    <Stage bg={bg}>
      <AnimatePresence mode="wait">
        <motion.div
          key={state.screen}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {state.screen === 'start' && <StartScreen />}
          {state.screen === 'places' && <PlaceSelectScreen />}
          {state.screen === 'trail' && <TrailScreen />}
        </motion.div>
      </AnimatePresence>
      <SoundToggle />
    </Stage>
  );
}

export default function App() {
  return (
    // reducedMotion="user": respeita prefers-reduced-motion do sistema.
    <MotionConfig reducedMotion="user">
      <ClayDefs />
      <GameProvider>
        <Screens />
      </GameProvider>
    </MotionConfig>
  );
}
