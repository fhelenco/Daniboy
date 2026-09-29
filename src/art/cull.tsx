import { createContext, createElement, useContext, useSyncExternalStore, type ComponentType } from 'react';

// Cada faixa do cenário tem mais de 10 000 unidades de largura, mas a tela mostra só ~2 000 de cada vez.
// Em vez de desenhar tudo (dezenas de milhares de formas), cada objeto só existe no DOM enquanto está
// perto da tela: o desenho é o mesmo, só que o celular deixa de carregar o que ninguém está vendo.

/** Quanto além da tela os objetos já aparecem (para nunca surgirem "do nada" à vista). */
const MARGIN = 700;
/** A janela só é recalculada a cada tanto de caminhada, e não a cada quadro. */
const CHUNK = 600;

export interface CullStore {
  subscribe: (cb: () => void) => () => void;
  range: () => readonly [lo: number, hi: number];
  /** Posição da faixa na tela (quanto ela já andou). */
  setPos: (pos: number) => void;
}

export function createCullStore(viewW: number, pos0: number): CullStore {
  const subs = new Set<() => void>();
  let idx = NaN;
  let range: readonly [number, number] = [-Infinity, Infinity];
  const setPos = (pos: number) => {
    const i = Math.floor(pos / CHUNK);
    if (i === idx) return;
    idx = i;
    range = [i * CHUNK - MARGIN, (i + 1) * CHUNK + viewW + MARGIN];
    subs.forEach((cb) => cb());
  };
  setPos(pos0);
  return {
    subscribe: (cb) => {
      subs.add(cb);
      return () => void subs.delete(cb);
    },
    range: () => range,
    setPos,
  };
}

export const CullCtx = createContext<CullStore | null>(null);

const noopSubscribe = () => () => {};

/** Largura extra que um objeto ocupa à direita de `x` (cercas, pontes, pegadas...). */
const extentOf = (p: Record<string, unknown>) => {
  const num = (k: string) => (typeof p[k] === 'number' ? (p[k] as number) : 0);
  return num('w') + num('posts') * num('gap') + num('n') * 120;
};

/** Faz um objeto do cenário (que tem `x`) sumir do DOM quando estiver longe da tela. */
export function culled<P extends { x: number }>(Comp: ComponentType<P>): ComponentType<P> {
  function Culled(props: P) {
    const store = useContext(CullCtx);
    const ext = extentOf(props as unknown as Record<string, unknown>);
    const visible = useSyncExternalStore(
      store ? store.subscribe : noopSubscribe,
      () => {
        if (!store) return true;
        const [lo, hi] = store.range();
        return props.x <= hi && props.x + ext >= lo;
      },
    );
    return visible ? createElement(Comp, props) : null;
  }
  Culled.displayName = `Culled(${Comp.displayName ?? Comp.name})`;
  return Culled;
}
