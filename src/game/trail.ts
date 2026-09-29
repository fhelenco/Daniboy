// Estado da trilha (vive enquanto a tela da trilha está aberta).
export interface TrailState {
  /** Botão de andar pressionado: 1 = para a direita, -1 = para a esquerda, 0 = parado. */
  dir: 0 | 1 | -1;
  /** Bicho em que o Daniboy parou e que ainda não foi tocado. */
  encounter: string | null;
  /** Bichos já conhecidos nesta caminhada. */
  met: string[];
  finished: boolean;
  /** Card de bicho aberto. */
  card: string | null;
  /** O bicho do card aberto ainda não estava no álbum (vai virar figurinha). */
  cardIsNew: boolean;
  /** Figurinha voando para o álbum. */
  sticker: string | null;
  /** Álbum aberto por cima da trilha (a caminhada fica guardada). */
  album: boolean;
}

export type TrailAction =
  | { type: 'HOLD'; dir: 0 | 1 | -1; only?: 1 | -1 }
  | { type: 'ARRIVE'; id: string }
  | { type: 'OPEN_CARD'; id: string; isNew: boolean }
  | { type: 'CLOSE_CARD' }
  | { type: 'STICKER_DONE' }
  | { type: 'ALBUM'; open: boolean }
  | { type: 'FINISH' };

export const initialTrail: TrailState = {
  dir: 0,
  encounter: null,
  met: [],
  finished: false,
  card: null,
  cardIsNew: false,
  sticker: null,
  album: false,
};

export function trailReducer(s: TrailState, a: TrailAction): TrailState {
  switch (a.type) {
    case 'HOLD':
      if (a.only !== undefined && s.dir !== a.only) return s; // soltou o botão do outro lado: ignora
      if (s.dir === a.dir) return s;
      if (a.dir !== 0 && (s.card || s.album)) return s; // com card ou álbum aberto, não anda
      // Voltar para trás desfaz a parada no bicho: ao chegar de novo, ele para outra vez.
      return { ...s, dir: a.dir, encounter: a.dir === -1 ? null : s.encounter };
    case 'ARRIVE':
      return { ...s, encounter: a.id };
    case 'OPEN_CARD':
      if (s.card) return s;
      return {
        ...s,
        dir: 0,
        card: a.id,
        cardIsNew: a.isNew,
        encounter: s.encounter === a.id ? null : s.encounter,
        met: s.met.includes(a.id) ? s.met : [...s.met, a.id],
      };
    case 'CLOSE_CARD':
      return { ...s, card: null, cardIsNew: false, sticker: s.cardIsNew ? s.card : s.sticker };
    case 'STICKER_DONE':
      return { ...s, sticker: null };
    case 'ALBUM':
      return { ...s, album: a.open, dir: 0 };
    case 'FINISH':
      return { ...s, finished: true, dir: 0 };
  }
}
