import { band } from '../Clay';
import { PALETTE, type ClayColor } from '../palette';

export const H = 900;
/** Onde o Daniboy fica na tela e a que distância o bicho aparece quando ele para. */
export const DANI_X = 430;
export const ANIMAL_SCREEN_X = 950;

/**
 * Cada camada é uma faixa longa (não se repete).
 * `width`: largura da faixa. `depth`: velocidade da camada.
 * `stops`: posições da trilha (worldX) onde o Daniboy para em cada bicho —
 * usadas para colocar pontes, árvores de moldura etc. sem atrapalhar os bichos.
 */
export interface LayerProps {
  width: number;
  depth: number;
  stops: number[];
}

/** Quanto o céu sobe além do topo do desenho (telas mais altas mostram mais céu). */
export const SKY_EXTRA = 800;

/**
 * Céu do cenário: gradiente preso ao desenho de 900 de altura, mas o retângulo sobe além do topo
 * (a cor do alto se repete), então telas mais altas que 16:9 ficam cheias de céu.
 */
export function SkyFill({ c, width }: { c: ClayColor; width: number }) {
  const [a, b, d] = PALETTE[c];
  const id = `sky-${c}`;
  return (
    <>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={H}>
          <stop offset="0" stopColor={a} />
          <stop offset="0.55" stopColor={b} />
          <stop offset="1" stopColor={d} />
        </linearGradient>
      </defs>
      <rect x={0} y={-SKY_EXTRA} width={width} height={H + SKY_EXTRA} fill={`url(#${id})`} />
    </>
  );
}

/** Faixa de chão/morro com gradiente vertical e grão de massinha. */
export function Band({ d, c, grain = true, o }: { d: string; c: ClayColor; grain?: boolean; o?: number }) {
  return (
    <g opacity={o}>
      <path d={d} fill={band(c)} />
      {grain && <path d={d} fill="url(#grain)" />}
    </g>
  );
}

/**
 * Posição, na camada, de algo que deve aparecer em `screenX` quando o Daniboy
 * estiver parado em `stop` (ex.: árvore de moldura na borda da tela).
 */
export const atStop = (stop: number, depth: number, screenX: number) => stop * depth + screenX;
