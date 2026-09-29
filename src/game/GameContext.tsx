import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { initialState, reducer, type Action, type GameState } from './state';
import { loadAlbum, saveAlbum } from './album';
import { setMuted } from '../audio/narrator';

const GameContext = createContext<{ state: GameState; dispatch: Dispatch<Action> } | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (s) => ({ ...s, album: loadAlbum() }));

  useEffect(() => setMuted(!state.soundOn), [state.soundOn]);
  useEffect(() => saveAlbum(state.album), [state.album]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame precisa estar dentro de <GameProvider>');
  return ctx;
}
