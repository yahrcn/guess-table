export type MediaIcon =
  | 'ship'
  | 'bolt'
  | 'crown'
  | 'mask'
  | 'heart'
  | 'skull'
  | 'star'
  | 'ring'
  | 'sword'
  | 'coin'
  | 'car'
  | 'ghost'
  | 'potion'
  | 'block'
  | 'ball'
  | 'crosshair'
  | 'key'
  | 'plane';

/** One hand-drawn pictogram per icon, centered on (50,50) — no hashing, picked per title. */
export function renderMediaIcon(icon: MediaIcon, accent: string, bg: string) {
  switch (icon) {
    case 'ship':
      return (
        <g fill={accent}>
          <path d="M28 58 L72 58 L64 74 L36 74 Z" />
          <rect x="48" y="30" width="3" height="28" />
          <path d="M51 32 L68 42 L51 46 Z" />
        </g>
      );
    case 'bolt':
      return <path d="M56 24 L34 54 L48 54 L42 76 L68 46 L54 46 Z" fill={accent} />;
    case 'crown':
      return (
        <path
          d="M28 64 L32 36 L44 50 L50 30 L56 50 L68 36 L72 64 Z"
          fill={accent}
        />
      );
    case 'mask':
      return (
        <g>
          <ellipse cx="50" cy="50" rx="26" ry="20" fill={accent} />
          <circle cx="40" cy="46" r="4" fill={bg} />
          <circle cx="60" cy="46" r="4" fill={bg} />
          <path d="M38 60 Q50 68 62 60" stroke={bg} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'heart':
      return (
        <path
          d="M50 72 C20 52 24 30 42 30 C48 30 50 36 50 36 C50 36 52 30 58 30 C76 30 80 52 50 72 Z"
          fill={accent}
        />
      );
    case 'skull':
      return (
        <g>
          <circle cx="50" cy="46" r="22" fill={accent} />
          <rect x="40" y="62" width="20" height="12" rx="3" fill={accent} />
          <circle cx="42" cy="44" r="5" fill={bg} />
          <circle cx="58" cy="44" r="5" fill={bg} />
        </g>
      );
    case 'star':
      return (
        <path
          d="M50 26 L58 44 L78 46 L62 59 L67 78 L50 67 L33 78 L38 59 L22 46 L42 44 Z"
          fill={accent}
        />
      );
    case 'ring':
      return <circle cx="50" cy="50" r="20" fill="none" stroke={accent} strokeWidth="8" />;
    case 'sword':
      return (
        <g fill={accent}>
          <rect x="47" y="24" width="6" height="40" />
          <path d="M50 64 L58 72 L50 80 L42 72 Z" />
          <rect x="36" y="56" width="28" height="6" rx="2" />
        </g>
      );
    case 'coin':
      return (
        <g>
          <circle cx="50" cy="50" r="22" fill={accent} />
          <circle cx="50" cy="50" r="16" fill="none" stroke={bg} strokeWidth="2" />
          <path d="M50 40 L54 48 L63 49 L56 55 L58 64 L50 59 L42 64 L44 55 L37 49 L46 48 Z" fill={bg} />
        </g>
      );
    case 'car':
      return (
        <g fill={accent}>
          <rect x="24" y="48" width="52" height="16" rx="6" />
          <path d="M32 48 L40 36 L60 36 L68 48 Z" />
          <circle cx="36" cy="66" r="7" fill="#1c1c1c" />
          <circle cx="64" cy="66" r="7" fill="#1c1c1c" />
        </g>
      );
    case 'ghost':
      return (
        <g fill={accent}>
          <path d="M30 70 V48 a20 20 0 0 1 40 0 V70 L62 62 L54 70 L46 62 L38 70 Z" />
          <circle cx="42" cy="46" r="3.4" fill="#1c1c1c" />
          <circle cx="58" cy="46" r="3.4" fill="#1c1c1c" />
        </g>
      );
    case 'potion':
      return (
        <g fill={accent}>
          <path d="M45 26 h10 v12 l12 20 a6 6 0 0 1 -5 9 h-24 a6 6 0 0 1 -5 -9 l12 -20 Z" />
          <rect x="43" y="22" width="14" height="5" fill="#1c1c1c" />
          <circle cx="50" cy="60" r="4" fill={bg} opacity="0.6" />
        </g>
      );
    case 'block':
      return (
        <g fill={accent}>
          <rect x="30" y="30" width="18" height="18" rx="2" />
          <rect x="52" y="30" width="18" height="18" rx="2" opacity="0.7" />
          <rect x="30" y="52" width="18" height="18" rx="2" opacity="0.7" />
          <rect x="52" y="52" width="18" height="18" rx="2" />
        </g>
      );
    case 'ball':
      return (
        <g>
          <circle cx="50" cy="50" r="22" fill={accent} />
          <path d="M28 50 h44 M50 28 v44" stroke={bg} strokeWidth="2" opacity="0.5" />
        </g>
      );
    case 'crosshair':
      return (
        <g stroke={accent} strokeWidth="3" fill="none">
          <circle cx="50" cy="50" r="18" />
          <line x1="50" y1="24" x2="50" y2="36" />
          <line x1="50" y1="64" x2="50" y2="76" />
          <line x1="24" y1="50" x2="36" y2="50" />
          <line x1="64" y1="50" x2="76" y2="50" />
        </g>
      );
    case 'key':
      return (
        <g fill={accent}>
          <circle cx="38" cy="50" r="12" fill="none" stroke={accent} strokeWidth="6" />
          <rect x="48" y="47" width="28" height="6" rx="2" />
          <rect x="64" y="53" width="6" height="8" />
          <rect x="72" y="53" width="6" height="10" />
        </g>
      );
    case 'plane':
      return <path d="M20 56 L80 44 L58 50 L62 74 L50 58 L38 74 L42 50 Z" fill={accent} />;
    default:
      return null;
  }
}
