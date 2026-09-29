import { useId } from 'react';

const PALETTE = ['#f4a259', '#7fc8a9', '#e8775f', '#f2c14e', '#a58df1', '#6ec6ff', '#c9a27a', '#f28bb0'];

export function colorFor(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

// Bichinho genérico de massinha, usado enquanto a arte final não existe.
// silhouette = figurinha ainda não encontrada no álbum.
export function ClayBlob({
  seed,
  silhouette = false,
  className,
}: {
  seed: string;
  silhouette?: boolean;
  className?: string;
}) {
  const id = useId();
  const c = silhouette ? '#7a6a86' : colorFor(seed);
  const fill = `url(#${id})`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="80%">
          <stop offset="0" style={{ stopColor: `color-mix(in srgb, ${c} 45%, white)` }} />
          <stop offset="0.55" style={{ stopColor: c }} />
          <stop offset="1" style={{ stopColor: `color-mix(in srgb, ${c} 65%, black)` }} />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="188" rx="64" ry="9" fill="rgb(0 0 0 / 0.15)" />
      <circle cx="56" cy="60" r="24" fill={fill} />
      <circle cx="144" cy="60" r="24" fill={fill} />
      <ellipse cx="100" cy="114" rx="80" ry="72" fill={fill} />
      {silhouette ? (
        <text x="100" y="146" textAnchor="middle" fontSize="96" fontWeight="800" fill="white" opacity="0.85">
          ?
        </text>
      ) : (
        <>
          <ellipse cx="74" cy="104" rx="11" ry="14" fill="#2b2233" />
          <ellipse cx="126" cy="104" rx="11" ry="14" fill="#2b2233" />
          <circle cx="70" cy="99" r="4" fill="white" />
          <circle cx="122" cy="99" r="4" fill="white" />
          <ellipse cx="58" cy="130" rx="11" ry="7" fill="#ff8fa3" opacity="0.6" />
          <ellipse cx="142" cy="130" rx="11" ry="7" fill="#ff8fa3" opacity="0.6" />
          <path d="M86 132 Q100 146 114 132" stroke="#2b2233" strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}
