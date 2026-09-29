/**
 * Modo leve, só para diagnóstico: abra o jogo com `?leve` no endereço para desligar o grão de massinha
 * (padrão SVG repetido em milhares de formas) e o filtro de feltro dos bichos. Se o jogo travar no celular
 * só sem `?leve`, o problema é a memória gasta por esses efeitos.
 */
export const LITE = typeof location !== 'undefined' && new URLSearchParams(location.search).has('leve');
