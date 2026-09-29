import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { RotateHint } from './RotateHint';

// Todo o jogo é desenhado num quadro de 1600×900 (16:9), mas o palco se adapta à tela inteira:
//  · tela mais larga que 16:9 (celular deitado, monitor wide): o palco ganha largura, até MAX_W;
//  · tela mais quadrada (tablet 4:3): o palco ganha altura (mais céu por cima), com tudo ancorado embaixo.
// O que foi desenhado em 1600×900 fica dentro do <Frame>, centralizado; fundos e botões vão até as bordas.
export const STAGE_H = 900;
export const DESIGN_W = 1600;
export const MAX_W = 2100;

export interface StageInfo {
  /** Largura e altura do palco, em unidades de desenho. */
  w: number;
  h: number;
  /** Altura a mais que os 900 do desenho (fica em cima). */
  extra: number;
  /** Pixels reais por unidade de desenho. */
  scale: number;
}

const StageCtx = createContext<StageInfo>({ w: DESIGN_W, h: STAGE_H, extra: 0, scale: 1 });
export const useStage = () => useContext(StageCtx);

/** Para desenhar algo (ex.: a capa de um card) como se o palco fosse exatamente o desenho de 1600×900. */
export function DesignStage({ children }: { children: ReactNode }) {
  const { scale } = useStage();
  return <StageCtx.Provider value={{ w: DESIGN_W, h: STAGE_H, extra: 0, scale }}>{children}</StageCtx.Provider>;
}

/** Tamanho mínimo em pixels reais → unidades de desenho (para alvos de toque em telas pequenas). */
export const useMinUnits = () => {
  const { scale } = useStage();
  return (minPx: number) => minPx / scale;
};

const compute = (cw: number, ch: number): StageInfo => {
  const aspect = cw / ch;
  const w = aspect >= DESIGN_W / STAGE_H ? Math.min(MAX_W, STAGE_H * aspect) : DESIGN_W;
  const h = aspect >= DESIGN_W / STAGE_H ? STAGE_H : DESIGN_W / aspect;
  const scale = Math.min(cw / w, ch / h);
  return { w, h, extra: h - STAGE_H, scale };
};

export function Stage({ bg, children }: { bg: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ cw: 1600, ch: 900 });

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setSize({ cw: r.width, ch: r.height });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener('orientationchange', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', fit);
    };
  }, []);

  const info = useMemo(() => compute(size.cw, size.ch), [size.cw, size.ch]);
  const portrait = size.cw / size.ch < 1.05;

  return (
    <div
      className="fixed inset-0 overflow-clip transition-colors duration-700"
      style={{
        background: bg,
        // recua o jogo do notch e dos cantos arredondados (celulares)
        paddingTop: 'env(safe-area-inset-top)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
      }}
    >
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
