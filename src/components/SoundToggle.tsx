import { useGame } from '../game/GameContext';
import { BigButton } from './BigButton';
import { SpeakerIcon } from './icons';
import { useStage } from './Stage';

// Para os adultos: sempre visível, no canto superior direito.
export function SoundToggle() {
  const { state, dispatch } = useGame();
  const { safe } = useStage();
  return (
    <div className="absolute z-50" style={{ right: 32 + safe.r, top: 32 + safe.t }}>
      <BigButton
        label={state.soundOn ? 'Desligar som' : 'Ligar som'}
        color={state.soundOn ? '#4fa3e0' : '#9aa3ad'}
        size={88}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: 'TOGGLE_SOUND' });
        }}
      >
        <SpeakerIcon size={56} on={state.soundOn} />
      </BigButton>
    </div>
  );
}
