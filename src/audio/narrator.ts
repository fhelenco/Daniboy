import { assetMissing } from '../assets/preload';

// Narração: tenta o mp3; se faltar, usa a voz sintética pt-BR; se nada existir, segue em silêncio.
// Nunca lança erro — o jogo continua de qualquer jeito.

export interface Line {
  text: string;
  audio?: string;
}

export type NarrateResult = 'done' | 'blocked' | 'stopped' | 'unavailable';

let muted = false;
let token = 0;
let currentAudio: HTMLAudioElement | null = null;
let cancelPending: (() => void) | null = null;

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
// Chrome carrega as vozes de forma assíncrona; pedir uma vez já "esquenta" a lista.
try {
  synth?.getVoices();
} catch {
  /* sem voz sintética */
}

export function setMuted(value: boolean) {
  muted = value;
  if (value) stopNarration();
}

export function stopNarration() {
  token++;
  cancelPending?.();
  cancelPending = null;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  try {
    synth?.cancel();
  } catch {
    /* ignore */
  }
}

/** true quando o navegador ainda não recebeu nenhum toque (áudio seria bloqueado). */
export function needsUserGesture() {
  const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } })
    .userActivation;
  return ua ? !ua.hasBeenActive : false;
}

export async function narrate(line: Line): Promise<NarrateResult> {
  stopNarration();
  const my = token;
  if (muted) return 'stopped';

  if (line.audio && !assetMissing(line.audio)) {
    const r = await playAudio(line.audio);
    if (my !== token) return 'stopped';
    if (r === 'done' || r === 'blocked') return r;
  }
  return speak(line.text, my);
}

function playAudio(src: string): Promise<'done' | 'blocked' | 'missing' | 'stopped'> {
  return new Promise((resolve) => {
    const a = new Audio(src);
    currentAudio = a;
    cancelPending = () => resolve('stopped');
    a.onended = () => resolve('done');
    a.onerror = () => resolve('missing');
    a.play().catch((e: unknown) =>
      resolve(e instanceof DOMException && e.name === 'NotAllowedError' ? 'blocked' : 'missing'),
    );
  });
}

function pickVoice() {
  const voices = synth?.getVoices() ?? [];
  const norm = (l: string) => l.replace('_', '-').toLowerCase();
  return (
    voices.find((v) => norm(v.lang) === 'pt-br') ?? voices.find((v) => norm(v.lang).startsWith('pt'))
  );
}

function speak(text: string, my: number): Promise<NarrateResult> {
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
    return Promise.resolve('unavailable');
  }
  return new Promise((resolve) => {
    let settled = false;
    const finish = (r: NarrateResult) => {
      if (!settled) {
        settled = true;
        resolve(r);
      }
    };
    cancelPending = () => finish('stopped');

    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR';
    const voice = pickVoice();
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.pitch = 1.15;
    u.onend = () => finish('done');
    u.onerror = (e) =>
      finish(
        e.error === 'not-allowed'
          ? 'blocked'
          : e.error === 'interrupted' || e.error === 'canceled'
            ? 'stopped'
            : 'unavailable',
      );

    // Falar logo depois de cancel() às vezes é ignorado no Chrome; um respiro resolve.
    setTimeout(() => {
      if (my !== token) return finish('stopped');
      try {
        synth.speak(u);
      } catch {
        finish('unavailable');
      }
    }, 60);
    // Rede de segurança: alguns navegadores nunca disparam onend/onerror.
    setTimeout(() => finish('done'), 2000 + text.length * 90);
  });
}
