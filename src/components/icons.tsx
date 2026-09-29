// Ícones grossos e arredondados, em creme com um relevo suave (como massinha pressionada num botão).
type P = { size?: number };

const CREAM = '#fff4d6';

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 100 100',
  fill: 'none',
  stroke: CREAM,
  strokeWidth: 13,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  // sombra deslocada para baixo e para a direita: dá a ideia de relevo
  style: { filter: 'drop-shadow(2px 4px 0 rgb(90 45 10 / 0.38)) drop-shadow(0 6px 5px rgb(60 30 5 / 0.18))' },
});

export const PlayIcon = ({ size = 100 }: P) => (
  <svg {...base(size)}>
    <path d="M36 24 L78 50 L36 76 Z" fill={CREAM} strokeWidth={15} />
  </svg>
);

export const ArrowIcon = ({ size = 100 }: P) => (
  <svg {...base(size)}>
    <path d="M20 50 H74 M52 26 L78 50 L52 74" strokeWidth={16} />
  </svg>
);

export const BackIcon = ({ size = 100 }: P) => (
  <svg {...base(size)}>
    <path d="M80 50 H26 M48 26 L22 50 L48 74" strokeWidth={16} />
  </svg>
);

export const CloseIcon = ({ size = 100 }: P) => (
  <svg {...base(size)}>
    <path d="M28 28 L72 72 M72 28 L28 72" strokeWidth={17} />
  </svg>
);

export const HomeIcon = ({ size = 100 }: P) => (
  <svg {...base(size)} strokeWidth={12}>
    <path d="M50 20 L84 50 H74 V78 H26 V50 H16 Z" fill={CREAM} />
    <path d="M44 78 V58 H56 V78" stroke="rgb(150 90 30 / 0.55)" strokeWidth={9} fill="rgb(150 90 30 / 0.25)" />
  </svg>
);

/** Álbum: livro aberto com uma estrelinha. */
export const AlbumIcon = ({ size = 100 }: P) => (
  <svg {...base(size)} strokeWidth={10}>
    <path d="M50 30C38 21 24 20 13 23V78C24 75 38 77 50 86C62 77 76 75 87 78V23C76 20 62 21 50 30Z" fill={CREAM} />
    <path d="M50 32V84" stroke="rgb(150 90 30 / 0.4)" strokeWidth={4} />
    <path d="M31 40L34.5 48L43 48.8L36.5 54.5L38.6 63L31 58.5L23.4 63L25.5 54.5L19 48.8L27.5 48Z" fill="#f7b731" stroke="none" />
  </svg>
);

export const SpeakerIcon = ({ size = 100, on = true }: P & { on?: boolean }) => (
  <svg {...base(size)}>
    <path d="M16 40 H34 L56 21 V79 L34 60 H16 Z" fill={CREAM} strokeWidth={9} />
    {on ? (
      <path d="M68 36 Q79 50 68 64 M78 25 Q95 50 78 75" strokeWidth={10} />
    ) : (
      <path d="M68 38 L90 62 M90 38 L68 62" strokeWidth={10} />
    )}
  </svg>
);

// ——— emblemas dos lugares (para quem ainda não lê) ———

export const TreeIcon = ({ size = 100 }: P) => (
  <svg {...base(size)} strokeWidth={9}>
    <path d="M44 84 V60 H56 V84 Z" fill={CREAM} />
    <path d="M50 14C34 14 22 26 24 40C14 44 14 60 28 62C34 70 66 70 72 62C86 60 86 44 76 40C78 26 66 14 50 14Z" fill={CREAM} />
  </svg>
);

export const CactusIcon = ({ size = 100 }: P) => (
  <svg {...base(size)} strokeWidth={9}>
    <path d="M42 84 V26 C42 16 58 16 58 26 V84 Z" fill={CREAM} />
    <path d="M42 62 H30 C24 62 24 58 24 52 V44 M58 50 H70 C76 50 76 46 76 40 V34" fill="none" strokeWidth={13} />
  </svg>
);

export const WaveIcon = ({ size = 100 }: P) => (
  <svg {...base(size)} strokeWidth={11}>
    <path d="M12 42 Q24 26 36 42 T60 42 T88 42" />
    <path d="M12 62 Q24 46 36 62 T60 62 T88 62" />
    <path d="M12 82 Q24 66 36 82 T60 82 T88 82" />
  </svg>
);

export const LockIcon = ({ size = 100 }: P) => (
  <svg {...base(size)} strokeWidth={9}>
    <path d="M32 46 V36 C32 14 68 14 68 36 V46" fill="none" strokeWidth={11} />
    <rect x="22" y="44" width="56" height="40" rx="10" fill={CREAM} />
  </svg>
);
