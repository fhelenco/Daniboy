import type { Line } from './narrator';

// Falas fixas do jogo. Os mp3 (voz Letícia, ElevenLabs) ficam em public/assets/voice/.
// Se mudar um texto, gere o mp3 de novo; ele não muda sozinho.
export const LINES = {
  welcome: { text: 'Oi, Daniel! Que bom que você chegou! Vamos passear e descobrir bichinhos?', audio: '/assets/voice/boas-vindas.mp3' },
  choosePlace: { text: 'Para onde vamos hoje? Toque no lugar que você quiser!', audio: '/assets/voice/escolher-lugar.mp3' },
  allFound: { text: 'Uhuu! Você conheceu todos os bichinhos! Parabéns, Daniel! Você é um grande explorador!', audio: '/assets/voice/todos.mp3' },
  album: {
    text: 'Olha o seu álbum, Daniel! Toque nas figurinhas para ouvir de novo!',
    audio: '/assets/voice/album.mp3',
  },
  albumMissing: {
    text: 'Ih... esse amiguinho ainda está escondido! Vamos procurar?',
    audio: '/assets/voice/escondido.mp3',
  },
} satisfies Record<string, Line>;
