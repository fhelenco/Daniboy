import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { RotateHint } from './RotateHint';

// Todo o jogo é desenhado num quadro de 1600×900 (16:9), mas o palco se adapta à tela inteira:
//  · tela mais larga que 16:9 (celular deitado, monitor wide): o palco ganha largura, até MAX_W;
//  · tela mais quadrada (tablet 4:3): o palco ganha altura (mais céu por cima), com tudo ancorado embaixo.
// O que foi desenhado em 1600×900 fica dentro do <Frame>, centralizado; fundos vão até as bordas da tela
// (inclusive por baixo do notch) e os botões ficam dentro da área segura (`safe`).
export const STAGE_H = 900;
export const DESIGN_W = 1600;
export const MAX_W = 2100;

/** Margens da área segura (notch, cantos arredondados, barra de início). */
export interface Insets {
  t: number;
  r: number;
  b: number;
  l: number;
}

const NO_INSETS: Insets = { t: 0, r: 0, b: 0, l: 0 };

export interface StageInfo {
  /** Largura e altura do palco, em unidades de desenho. */
  w: number;
  h: number;
  /** Altura a mais que os 900 do desenho (fica em cima). */
  extra: number;
  /** Pixels reais por unidade de desenho. */
  scale: number;
  /** Área segura da tela, em unidades de desenho: botões nas bordas devem somar isto à sua margem. */
  safe: Insets;
}

const StageCtx = createContext<StageInfo>({ w: DESIGN_W, h: STAGE_H, extra: 0, scale: 1, safe: NO_INSETS });
export const useStage = () => useContext(StageCtx);

/** Para desenhar algo (ex.: a capa de um card) como se o palco fosse exatamente o desenho de 1600×900. */
export function DesignStage({ children }: { children: ReactNode }) {
  const { scale } = useStage();
  return <StageCtx.Provider value={{ w: DESIGN_W, h: STAGE_H, extra: 0, scale, safe: NO_INSETS }}>{children}</StageCtx.Provider>;
}

/** Tamanho mínimo em pixels reais → unidades de desenho (para alvos de toque em telas pequenas). */
export const useMinUnits = () => {
  const { scale } = useStage();
  return (minPx: number) => minPx / scale;
};

const compute = (cw: number, ch: number, insets: Insets): StageInfo => {
  const aspect = cw / ch;
  const w = aspect >= DESIGN_W / STAGE_H ? Math.min(MAX_W, STAGE_H * aspect) : DESIGN_W;
  const h = aspect >= DESIGN_W / STAGE_H ? STAGE_H : DESIGN_W / aspect;
  const scale = Math.min(cw / w, ch / h);
  return {
    w,
    h,
    extra: h - STAGE_H,
    scale,
    safe: { t: insets.t / scale, r: insets.r / scale, b: insets.b / scale, l: insets.l / scale },
  };
};

const px = (v: string) => Math.round(parseFloat(v) || 0);

export function Stage({ bg, children }: { bg: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ cw: 1600, ch: 900 });
  const [insets, setInsets] = useState<Insets>(NO_INSETS);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setSize({ cw: r.width, ch: r.height });
      // a área segura vem do CSS (env), lida num elemento escondido que usa esses valores como margem
      const p = probe.current && getComputedStyle(probe.current);
      if (p) {
        const next = { t: px(p.paddingTop), r: px(p.paddingRight), b: px(p.paddingBottom), l: px(p.paddingLeft) };
        setInsets((cur) => (cur.t === next.t && cur.r === next.r && cur.b === next.b && cur.l === next.l ? cur : next));
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener('orientationchange', fit);
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', fit);
      window.removeEventListener('resize', fit);
    };
  }, []);

  const info = useMemo(() => compute(size.cw, size.ch, insets), [size.cw, size.ch, insets]);
  const portrait = size.cw / size.ch < 1.05;

  return (
    <div className="fixed inset-0 overflow-clip transition-colors duration-700" style={{ background: bg }}>
      <div
        ref={probe}
        aria-hidden
        className="pointer-events-none invisible absolute inset-0"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
        }}
      />
      <div ref={box} className="flex h-full w-full items-center justify-center">
        <div className="relative" style={{ width: info.w * info.scale, height: info.h * info.scale }}>
          <div
            className="absolute left-0 top-0 overflow-clip"
            style={{ width: info.w, height: info.h, transform: `scale(${info.scale})`, transformOrigin: '0 0' }}
          >
            <StageCtx.Provider value={info}>{children}</StageCtx.Provider>
          </div>
        </div>
      </div>
      {portrait && <RotateHint />}
    </div>
  );
}

/**
 * Área de desenho de 1600×900, centralizada na largura do palco e ancorada embaixo
 * (`center` = centralizada também na altura, para janelas e cartões).
 */
export function Frame({ children, center = false, className = '' }: { children: ReactNode; center?: boolean; className?: string }) {
  const { w, h, extra } = useStage();
  const style: CSSProperties = { left: (w - DESIGN_W) / 2, top: center ? (h - STAGE_H) / 2 : extra, width: DESIGN_W, height: STAGE_H };
  return (
    <div className={`absolute ${className}`} style={style}>
      {children}
    </div>
  );
}
