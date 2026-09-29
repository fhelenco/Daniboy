// Imagens do Daniboy (fundo transparente, 768×1152: 2:3, leves para o celular). Ficam em public/assets/daniboy/.
// Se um arquivo não existir, o jogo usa o desenho em SVG no lugar.
export const daniboyImages = {
  /** De frente, acenando: início, escolher lugar e volta do fim da trilha. */
  wave: '/assets/daniboy/acenando.webp',
  /** De lado, parado no meio do passo: trilha, quando ele não está andando. */
  walk: '/assets/daniboy/andando.webp',
  /** Agachado olhando para a direita: quando encontra um bicho. */
  point: '/assets/daniboy/agachado.webp',
  /** Inclinado e curioso: o instante em que ele chega perto do bicho, antes de agachar. */
  lean: '/assets/daniboy/curioso.webp',
  /** Pulando de braços abertos: quando toca nele e na festa. */
  jump: '/assets/daniboy/pulando.webp',
  /** Punho para cima, comemorando (festa). */
  fist: '/assets/daniboy/comemorando.webp',
  /** Braços para cima, feliz (festa). */
  cheer: '/assets/daniboy/feliz.webp',
  /** De costas andando (fim da trilha, ele vai embora). */
  back: '/assets/daniboy/costas.webp',
  /** De costas, outro passo. */
  backStep: '/assets/daniboy/costas-andando.webp',
  /** De costas, parado. Ainda não usada no jogo. */
  backStill: '/assets/daniboy/costas-parado.webp',
  /** Olhando para trás por cima do ombro. Ainda não usada no jogo. */
  lookBack: '/assets/daniboy/olhando-atras.webp',
};

/**
 * Quadros de UM passo, na ordem da animação (o ciclo se repete a cada passo):
 *  8, 10, 9  pernas se cruzando, uma passa pela outra
 *  3         o pé da frente sobe e estica
 *  4, 13, 11, 1, 12   pisada aberta (o pé encosta no chão e o corpo passa por cima)
 *  2, 5      o pé de trás sobe (impulso)
 *  6, 7      a perna vem para a frente e se aproxima da outra, voltando ao começo
 * O quadro troca conforme a distância andada, então os pés acompanham o chão.
 * Guardadas fora do ciclo: andando-extra-b.webp e andando-extra-c.webp (não encaixam sem quebrar a passada).
 */
export const daniboyWalkCycle = [8, 10, 9, 3, 4, 13, 11, 1, 12, 2, 5, 6, 7].map((n) => `/assets/daniboy/andando-${n}.webp`);

/** Quantos px o Daniboy anda a cada quadro da caminhada (ajuste se os pés "patinarem"). */
export const WALK_PX_PER_FRAME = 16;

/** Indo embora de costas: os dois passos se alternam. */
export const daniboyBackCycle = [daniboyImages.back, daniboyImages.backStep];

/** Festa: ele dança alternando as poses de alegria. */
export const daniboyCheerCycle = [daniboyImages.fist, daniboyImages.jump, daniboyImages.cheer, daniboyImages.jump];
