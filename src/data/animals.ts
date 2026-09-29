import type { Animal } from './types';

// Os textos abaixo são os mesmos das falas gravadas com a voz Letícia (ElevenLabs), em
// public/assets/<lugar>/<id>.mp3. Se você mudar um texto, gere o mp3 de novo (ele não muda sozinho).
// Se o arquivo não existir, o jogo usa a voz do aparelho lendo este texto.

export const forestAnimals: Animal[] = [
  {
    id: 'capivara',
    name: 'Capivara',
    image: '/assets/forest/capivara.png',
    audio: '/assets/forest/capivara.mp3',
    narration:
      'Olha, Daniel, é a capivara! Ela é a maior da família dos ratinhos... e adora nadar! Repara: tem um passarinho passeando nas costas dela!',
    x: 1400,
  },
  {
    id: 'tucano',
    name: 'Tucano',
    image: '/assets/forest/tucano.png',
    audio: '/assets/forest/tucano.mp3',
    narration:
      'Uau, que bico! Esse é o tucano! Apesar de enorme, o bico dele é levinho, levinho! Ele usa o bico para pegar frutinhas lá no alto.',
    x: 2700,
  },
  {
    id: 'macaco',
    name: 'Macaco',
    image: '/assets/forest/macaco.png',
    audio: '/assets/forest/macaco.mp3',
    narration:
      'Uh, uh, ah, ah! É o macaquinho! Ele usa as mãos e os pés para se pendurar nos galhos. Pula daqui, pula dali! Você consegue pular igual a ele?',
    x: 4000,
  },
  {
    id: 'preguica',
    name: 'Preguiça',
    image: '/assets/forest/preguica.png',
    audio: '/assets/forest/preguica.mp3',
    narration:
      'Psiu... fala baixinho! É a preguiça. Ela é um dos bichos mais devagarzinhos do mundo! Sabia que ela só desce da árvore uma vez por semana... para ir ao banheirinho?',
    x: 5300,
  },
  {
    id: 'tatu',
    name: 'Tatu',
    image: '/assets/forest/tatu.png',
    audio: '/assets/forest/tatu.mp3',
    narration:
      'Esse é o tatu-bola! Ele tem uma casca durinha, que nem uma armadura. E olha só: quando fica com medo, ele vira uma bolinha! Que esperto!',
    x: 6600,
  },
];

export const desertAnimals: Animal[] = [
  {
    id: 'camelo',
    name: 'Camelo',
    image: '/assets/desert/camelo.png',
    audio: '/assets/desert/camelo.mp3',
    narration:
      'Que grandão! É o camelo! Na corcova ele guarda gordurinha, que dá energia para andar pelo deserto. E tem cílios bem compridos para a areia não entrar no olho!',
    x: 1400,
  },
  {
    id: 'feneco',
    name: 'Feneco',
    image: '/assets/desert/feneco.png',
    audio: '/assets/desert/feneco.mp3',
    narration:
      'Olha essas orelhonas! É o feneco, a menor raposa do mundo! As orelhas gigantes ajudam a ouvir bem longe e a esfriar o corpinho.',
    x: 2700,
  },
  {
    id: 'suricato',
    name: 'Suricato',
    image: '/assets/desert/suricato.png',
    audio: '/assets/desert/suricato.mp3',
    narration:
      'Oi, Daniel! É o suricato! Ele fica em pé, bem esticadinho, para vigiar a família. Se vê perigo, dá um gritinho de alerta! Você consegue ficar assim?',
    x: 4000,
  },
  {
    id: 'lagarto',
    name: 'Lagarto',
    image: '/assets/desert/lagarto.png',
    audio: '/assets/desert/lagarto.mp3',
    narration:
      'Shhh... é o lagarto tomando sol! O sol é o aquecedor dele. E tem um truque: alguns lagartos soltam o rabinho para fugir, e nasce outro!',
    x: 5300,
  },
  {
    id: 'coruja',
    name: 'Coruja-buraqueira',
    image: '/assets/desert/coruja.png',
    audio: '/assets/desert/coruja.mp3',
    narration:
      'Uh, uh! É a coruja-buraqueira! Ela mora num buraquinho no chão e fica de guarda na porta da casinha. E gira a cabeça para todos os lados!',
    x: 6600,
  },
];

export const oceanAnimals: Animal[] = [
  {
    id: 'caranguejo',
    name: 'Caranguejo',
    image: '/assets/ocean/caranguejo.png',
    audio: '/assets/ocean/caranguejo.mp3',
    narration:
      'Clac, clac! É o caranguejo! Ele anda de ladinho, olha só! E tem dez patinhas, contando as garras. Vamos contar juntos?',
    x: 1400,
  },
  {
    id: 'tartaruga',
    name: 'Tartaruga',
    image: '/assets/ocean/tartaruga.png',
    audio: '/assets/ocean/tartaruga.mp3',
    narration:
      'Devagar e sempre! É a tartaruga-marinha! Ela usa as nadadeiras como remos e volta para a praia para colocar os ovinhos na areia. Que mamãe corajosa!',
    x: 2700,
  },
  {
    id: 'golfinho',
    name: 'Golfinho',
    image: '/assets/ocean/golfinho.png',
    audio: '/assets/ocean/golfinho.mp3',
    narration:
      'Splash! Olha o golfinho pulando! Ele conversa com os amigos por assobios e cliques. E respira ar, igual a gente, por um buraquinho na cabeça!',
    x: 4000,
    y: 150,
  },
  {
    id: 'estrela',
    name: 'Estrela-do-mar',
    image: '/assets/ocean/estrela.png',
    audio: '/assets/ocean/estrela.mp3',
    narration:
      'Olha a estrela-do-mar! Ela tem cinco bracinhos e muitos pezinhos minúsculos embaixo. E o mais legal: se perde um bracinho, nasce outro!',
    x: 5300,
  },
  {
    id: 'baleia',
    name: 'Baleia',
    image: '/assets/ocean/baleia.png',
    audio: '/assets/ocean/baleia.mp3',
    narration:
      "Uau, que enorme! É a baleia! Algumas são maiores que dois ônibus juntos! Ela solta um esguicho lá em cima e canta canções debaixo d'água.",
    x: 6600,
    y: 170,
  },
];
