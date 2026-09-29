// Álbum de figurinhas: quais bichos o Daniel já conheceu, por lugar.
// Fica salvo no navegador; se o armazenamento falhar, o jogo segue normalmente (só não lembra).

export type Album = Record<string, string[]>;

const KEY = 'daniboy.album.v1';

export function loadAlbum(): Album {
  try {
    const raw = localStorage.getItem(KEY);
    const data: unknown = raw ? JSON.parse(raw) : {};
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    const album: Album = {};
    for (const [env, ids] of Object.entries(data)) {
      if (Array.isArray(ids)) album[env] = ids.filter((id): id is string => typeof id === 'string');
    }
    return album;
  } catch {
    return {};
  }
}

export function saveAlbum(album: Album) {
  try {
    localStorage.setItem(KEY, JSON.stringify(album));
  } catch {
    /* sem armazenamento: segue sem salvar */
  }
}

export const hasSticker = (album: Album, envId: string, animalId: string) => (album[envId] ?? []).includes(animalId);
