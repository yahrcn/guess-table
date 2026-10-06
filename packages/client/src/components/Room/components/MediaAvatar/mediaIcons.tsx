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
  | 'plane'
  | 'magnifier'
  | 'flask'
  | 'chefHat'
  | 'bowl'
  | 'bread'
  | 'noodles'
  | 'pizza'
  | 'cup'
  | 'shirt'
  | 'dress'
  | 'shoe'
  | 'hat'
  | 'bag'
  | 'camera'
  | 'play'
  | 'chat'
  | 'laptop'
  | 'globe';

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
    case 'magnifier':
      return (
        <g stroke={accent} strokeWidth="6" fill="none">
          <circle cx="42" cy="42" r="16" />
          <line x1="54" y1="54" x2="74" y2="74" strokeLinecap="round" />
        </g>
      );
    case 'flask':
      return (
        <g fill={accent}>
          <path d="M42 26 h16 v16 l14 24 a7 7 0 0 1 -6 10 h-32 a7 7 0 0 1 -6 -10 l14 -24 Z" />
          <rect x="40" y="22" width="20" height="6" fill="#1c1c1c" />
        </g>
      );
    case 'chefHat':
      return (
        <g fill={accent}>
          <rect x="32" y="60" width="36" height="16" rx="3" />
          <circle cx="38" cy="46" r="12" />
          <circle cx="50" cy="40" r="14" />
          <circle cx="62" cy="46" r="12" />
        </g>
      );
    case 'bowl':
      return (
        <g fill={accent}>
          <path d="M26 52 a24 16 0 0 0 48 0 Z" />
          <rect x="24" y="50" width="52" height="6" rx="3" />
        </g>
      );
    case 'bread':
      return (
        <g>
          <ellipse cx="50" cy="56" rx="26" ry="18" fill={accent} />
          <g stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round">
            <line x1="38" y1="42" x2="34" y2="54" />
            <line x1="50" y1="40" x2="48" y2="54" />
            <line x1="62" y1="42" x2="66" y2="54" />
          </g>
        </g>
      );
    case 'noodles':
      return (
        <g>
          <path d="M26 54 a24 16 0 0 0 48 0 Z" fill={accent} />
          <rect x="24" y="52" width="52" height="6" rx="3" fill={accent} />
          <g stroke="#1c1c1c" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M36 50 q4 -8 0 -16" />
            <path d="M50 50 q4 -8 0 -16" />
            <path d="M64 50 q4 -8 0 -16" />
          </g>
        </g>
      );
    case 'pizza':
      return (
        <g>
          <path d="M50 26 L76 70 a30 30 0 0 1 -52 0 Z" fill={accent} />
          <circle cx="50" cy="46" r="4" fill="#1c1c1c" />
          <circle cx="42" cy="58" r="4" fill="#1c1c1c" />
          <circle cx="58" cy="58" r="4" fill="#1c1c1c" />
        </g>
      );
    case 'cup':
      return (
        <g>
          <rect x="32" y="40" width="30" height="30" rx="4" fill={accent} />
          <path d="M62 46 h8 a8 8 0 0 1 0 16 h-8" fill="none" stroke={accent} strokeWidth="5" />
        </g>
      );
    case 'shirt':
      return (
        <path d="M38 28 L50 34 L62 28 L76 40 L66 50 L62 46 V74 H38 V46 L34 50 L24 40 Z" fill={accent} />
      );
    case 'dress':
      return (
        <path d="M42 26 h16 l4 10 l14 38 a4 4 0 0 1 -4 6 H28 a4 4 0 0 1 -4 -6 l14 -38 Z" fill={accent} />
      );
    case 'shoe':
      return (
        <path d="M22 62 h8 l6 -10 q6 -6 14 -6 h14 l12 10 h4 a6 6 0 0 1 6 6 v4 H22 Z" fill={accent} />
      );
    case 'hat':
      return (
        <g fill={accent}>
          <ellipse cx="50" cy="60" rx="28" ry="7" />
          <path d="M38 60 q0 -26 12 -26 q12 0 12 26 Z" />
        </g>
      );
    case 'bag':
      return (
        <g>
          <rect x="28" y="42" width="44" height="32" rx="6" fill={accent} />
          <path d="M38 42 v-6 a12 12 0 0 1 24 0 v6" fill="none" stroke={accent} strokeWidth="5" />
        </g>
      );
    case 'camera':
      return (
        <g fill={accent}>
          <rect x="26" y="38" width="48" height="34" rx="6" />
          <rect x="40" y="30" width="20" height="10" rx="2" />
          <circle cx="50" cy="55" r="10" fill={bg} />
          <circle cx="50" cy="55" r="6" fill={accent} />
        </g>
      );
    case 'play':
      return (
        <g>
          <circle cx="50" cy="50" r="26" fill={accent} />
          <path d="M44 38 L64 50 L44 62 Z" fill={bg} />
        </g>
      );
    case 'chat':
      return (
        <g fill={accent}>
          <rect x="24" y="30" width="52" height="34" rx="10" />
          <path d="M38 64 l-6 10 l14 -10 Z" />
        </g>
      );
    case 'laptop':
      return (
        <g>
          <rect x="28" y="32" width="44" height="28" rx="2" fill="#1c1c1c" />
          <line x1="34" y1="40" x2="52" y2="40" stroke={accent} strokeWidth="2.4" />
          <line x1="34" y1="48" x2="60" y2="48" stroke={accent} strokeWidth="2.4" />
          <rect x="20" y="62" width="60" height="6" rx="3" fill={accent} />
        </g>
      );
    case 'globe':
      return (
        <g stroke={accent} strokeWidth="3" fill="none">
          <circle cx="50" cy="50" r="24" />
          <ellipse cx="50" cy="50" rx="10" ry="24" />
          <line x1="26" y1="50" x2="74" y2="50" />
        </g>
      );
    default:
      return null;
  }
}
