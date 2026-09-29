export interface Animal {
  id: string;
  name: string;
  /** PNG estilo clay, fundo transparente. Se não existir, aparece o desenho placeholder. */
  image: string;
  /** mp3 gravado. Se não existir, a narração usa a voz sintética em pt-BR. */
  audio?: string;
  /** Texto curto, 2–3 frases, falando com o Daniel. */
  narration: string;
  /** Posição na trilha, em pixels do mundo (a tela tem 1600 de largura). */
  x: number;
  /** Opcional: altura acima da trilha, para bichos na água ou no alto. */
  y?: number;
}

export interface ParallaxLayer {
  /** PNG 1600×900 que se repete na horizontal (emenda sem costura). */
  src: string;
  /** 1 = anda junto com o chão; maior que 1 = passa na frente do Daniboy (mais rápido). */
  depth: number;
}

export type TapEffect = 'leaves' | 'sand' | 'bubbles';

export interface Environment {
  id: string;
  name: string;
  /** Imagem do card em "escolher lugar". Sem ela, o card mostra o começo da trilha. */
  cover: string;
  layers: ParallaxLayer[];
  animals: Animal[];
  /** Opcional: mp3 com o nome do lugar. Sem ele, usa a voz sintética. */
  nameAudio?: string;
  /** Opcional: onde a trilha termina. Padrão: último animal + 1200. */
  trailLength?: number;
  /** Opcional: cor das bordas em volta do cenário. */
  bgColor?: string;
  /** Opcional: o que aparece ao tocar num lugar vazio. Padrão: folhas. */
  tapEffect?: TapEffect;
}
