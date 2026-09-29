import type { Album } from './album';

export type Screen = 'start' | 'places' | 'trail';

export interface GameState {
  screen: Screen;
  environmentId: string | null;
  soundOn: boolean;
  album: Album;
}

export type Action =
  | { type: 'GO'; screen: Screen }
  | { type: 'PICK_ENV'; id: string }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'COLLECT'; envId: string; animalId: string };

export const initialState: GameState = {
  screen: 'start',
  environmentId: null,
  soundOn: true,
  album: {},
};

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'GO':
      return { ...state, screen: action.screen };
    case 'PICK_ENV':
      return { ...state, environmentId: action.id, screen: 'trail' };
    case 'TOGGLE_SOUND':
      return { ...state, soundOn: !state.soundOn };
    case 'COLLECT': {
      const found = state.album[action.envId] ?? [];
      if (found.includes(action.animalId)) return state;
      return { ...state, album: { ...state.album, [action.envId]: [...found, action.animalId] } };
    }
  }
}
