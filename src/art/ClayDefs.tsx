import { PALETTE } from './palette';

const GRAIN_SIZE = 128;

// Textura de massinha: pontinhos claros/escuros e manchas suaves (como marcas de dedo).
// Gerada uma vez num canvas e usada como padrão por cima das formas.
function makeGrain() {
  if (typeof document === 'undefined') return '';
  const s = GRAIN_SIZE;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  for (let i = 0; i < 16; i++) {
    const x = rnd() * s;
    const y = rnd() * s;
    const r = 10 + rnd() * 24;
    const light = rnd() > 0.5;
    for (const dx of [-s, 0, s])
      for (const dy of [-s, 0, s]) {
        const g = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
        g.addColorStop(0, light ? 'rgba(255,255,255,0.08)' : 'rgba(90,50,20,0.07)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
      }
  }
  for (let i = 0; i < 1300; i++) {
    const light = rnd() > 0.55;
    ctx.fillStyle = light
      ? `rgba(255,255,255,${0.05 + rnd() * 0.12})`
      : `rgba(70,40,15,${0.04 + rnd() * 0.1})`;
    ctx.beginPath();
    ctx.arc(rnd() * s, rnd() * s, 0.4 + rnd() * 1.1, 0, Math.PI * 2);
    ctx.fill();
  }
  return c.toDataURL('image/png');
}

const GRAIN = makeGrain();

// Definições globais (gradientes, sombra, brilho e grão). Montado uma vez no App;
// qualquer SVG da página pode usar url(#c-...), url(#v-...), url(#shadow), url(#grain).
export function ClayDefs() {
  return (
    <svg aria-hidden style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        {Object.entries(PALETTE).map(([name, [light, base, dark]]) => (
          <g key={name}>
            <radialGradient id={`c-${name}`} cx="0.36" cy="0.3" r="0.78">
              <stop offset="0" stopColor={light} />
              <stop offset="0.5" stopColor={base} />
              <stop offset="1" stopColor={dark} />
            </radialGradient>
            <linearGradient id={`v-${name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={light} />
              <stop offset="0.55" stopColor={base} />
              <stop offset="1" stopColor={dark} />
            </linearGradient>
          </g>
        ))}
        {/* pelúcia: bordas levemente "peludinhas", como feltro */}
        <filter id="fuzz" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id="shadow">
          <stop offset="0" stopColor="rgb(60 30 10 / 0.38)" />
          <stop offset="0.6" stopColor="rgb(60 30 10 / 0.16)" />
          <stop offset="1" stopColor="rgb(60 30 10 / 0)" />
        </radialGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor="rgb(255 246 170 / 0.95)" />
          <stop offset="0.5" stopColor="rgb(255 226 120 / 0.45)" />
          <stop offset="1" stopColor="rgb(255 220 100 / 0)" />
        </radialGradient>
        <radialGradient id="sheen">
          <stop offset="0" stopColor="rgb(255 255 255 / 0.6)" />
          <stop offset="1" stopColor="rgb(255 255 255 / 0)" />
        </radialGradient>
        <pattern id="grain" patternUnits="userSpaceOnUse" width={GRAIN_SIZE} height={GRAIN_SIZE}>
          <image href={GRAIN} width={GRAIN_SIZE} height={GRAIN_SIZE} />
        </pattern>
      </defs>
    </svg>
  );
}
