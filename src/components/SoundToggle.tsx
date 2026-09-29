import { useGame } from '../game/GameContext';
import { BigButton } from './BigButton';
import { SpeakerIcon } from './icons';

// Para os adultos: sempre visível, no canto superior direito.
export function SoundToggle() {
  const { state, dispatch } = useGame();
  return (
    <div className="absolute right-8 top-8 z-50">
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
