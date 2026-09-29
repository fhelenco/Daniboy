// Ícones simples e grossos, desenhados para crianças. Brancos, com contorno arredondado.
type P = { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 100 100',
  fill: 'none',
  stroke: 'white',
  strokeWidth: 12,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  style: { filter: 'drop-shadow(0 3px 2px rgb(0 0 0 / 0.2))' },
});

export const PlayIcon = ({ size = 100 }: P) => (
  <svg {...base(size)}>
    <path d="M34 22 L78 50 L34 78 Z" fill="white" />
  </svg>
);

export const ArrowIcon = ({ size = 100 }: P) => (
  <svg {...base(size)}>
    <path d="M20 50 H74 M52 26 L78 50 L52 74" />
  </svg>
);

export const BackIcon = ({ size = 100 }: P) => (
  <svg {...base(size)}>
    <path d="M80 50 H26 M48 26 L22 50 L48 74" />
  </svg>
);

export const CloseIcon =({ size = 100 }: P) => (
  <svg {...base(size)}>
    <path d="M28 28 L72 72 M72 28 L28 72" />
  </svg>
);

export const HomeIcon = ({ size = 100 }: P) => (
  <svg {...base(size)}>
    <path d="M18 50 L50 22 L82 50 M28 42 V80 H72 V42" />
  </svg>
);

/** Álbum: livrinho aberto com uma estrela. */
export const AlbumIcon = ({ size = 100 }: P) => (
  <svg {...base(size)} strokeWidth={9}>
    <path d="M50 30C38 22 24 20 14 22V78C24 76 38 78 50 86C62 78 76 76 86 78V22C76 20 62 22 50 30Z" fill="white" />
    <path d="M50 30V86" stroke="rgb(0 0 0 / 0.15)" strokeWidth={4} />
    <path d="M32 44L35 51L42 51.5L36.5 56L38.5 63L32 59L25.5 63L27.5 56L22 51.5L29 51Z" fill="#f8c733" stroke="none" />
  </svg>
);

export const SpeakerIcon =({ size = 100, on = true }: P & { on?: boolean }) => (
  <svg {...base(size)}>
    <path d="M18 40 H34 L54 22 V78 L34 60 H18 Z" fill="white" strokeWidth={8} />
    {on ? (
      <path d="M66 36 Q76 50 66 64 M76 26 Q92 50 76 74" strokeWidth={9} />
    ) : (
      <path d="M66 38 L88 62 M88 38 L66 62" strokeWidth={9} />
    )}
  </svg>
);
