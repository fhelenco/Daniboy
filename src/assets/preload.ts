import { useEffect, useState } from 'react';
import type { Environment } from '../data/types';

// Guarda quais arquivos existem, para nunca mostrar imagem quebrada nem esperar mp3 que não existe.
const status = new Map<string, boolean>();

export const assetOk = (src?: string) => !!src && status.get(src) === true;
export const assetMissing = (src?: string) => !src || status.get(src) === false;

export function preloadImage(src: string): Promise<void> {
  if (status.has(src)) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      status.set(src, true);
      resolve();
    };
    img.onerror = () => {
      status.set(src, false);
      resolve();
    };
    img.src = src;
  });
}

export function preloadAudio(src: string): Promise<void> {
  if (status.has(src)) return Promise.resolve();
  return new Promise((resolve) => {
    const a = new Audio();
    let done = false;
    const finish = (ok: boolean | null) => {
      if (done) return;
      done = true;
      if (ok !== null) status.set(src, ok);
      resolve();
    };
    a.oncanplaythrough = () => finish(true);
    a.onerror = () => finish(false);
    // Alguns navegadores só carregam áudio depois de um toque: não travar o carregamento.
    setTimeout(() => finish(null), 4000);
    a.preload = 'auto';
    a.src = src;
    a.load();
  });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Pré-carrega imagens e áudios de um lugar. Mostra o loading por pelo menos `minMs`. */
export function usePreload(env: Environment, minMs = 2400) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    setReady(false);
    setProgress(0);
    const images = [
      ...env.layers.map((l) => l.src),
      ...env.animals.map((a) => a.image),
    ];
    const audios = [...env.animals.flatMap((a) => (a.audio ? [a.audio] : [])), ...(env.nameAudio ? [env.nameAudio] : [])];
    const tasks = [...images.map(preloadImage), ...audios.map(preloadAudio)];
    let n = 0;
    tasks.forEach((t) => t.then(() => alive && setProgress(++n / tasks.length)));
    Promise.all([Promise.all(tasks), wait(minMs)]).then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [env, minMs]);

  return { progress, ready };
}

/** Re-renderiza quando os arquivos da lista terminarem de ser checados. */
export function useAssetsChecked(srcs: string[]) {
  const key = srcs.join('|');
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    Promise.all(key.split('|').filter(Boolean).map(preloadImage)).then(() => alive && setTick((t) => t + 1));
    return () => {
      alive = false;
    };
  }, [key]);
  return tick;
}
