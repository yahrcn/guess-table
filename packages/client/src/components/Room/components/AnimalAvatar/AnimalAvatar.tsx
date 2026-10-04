import { hashSeed } from '../avatarHash';

const BG_COLORS = ['#CDE7D8', '#FCE9C9', '#D9E8F5', '#F6DADA', '#E6E0C8', '#DCEFE0', '#F2E2CE'];
const FUR_COLORS = ['#C68642', '#8D5524', '#E0AC69', '#4A4A4A', '#D9B382', '#F1C27D', '#6B4226', '#B5A183'];
const PATTERN_COLORS = ['#2B2118', '#5A3A22', '#FFFFFF', '#7A4E2D'];

interface Props {
  seed: string;
  size?: number;
  title?: string;
}

/**
 * Deterministic animal-face SVG generated from `seed` — same idea as the person Avatar,
 * just a different shape vocabulary (ears/snout/pattern) so animal-deck cards don't look
 * like tiny human faces.
 */
export const AnimalAvatar = ({ seed, size = 96, title }: Props) => {
  const hash = hashSeed(seed);
  const bg = BG_COLORS[hash % BG_COLORS.length];
  const fur = FUR_COLORS[Math.floor(hash / 7) % FUR_COLORS.length];
  const pattern = PATTERN_COLORS[Math.floor(hash / 49) % PATTERN_COLORS.length];
  const earStyle = Math.floor(hash / 343) % 3; // 0 round, 1 pointy, 2 floppy
  const patternStyle = Math.floor(hash / 2401) % 3; // 0 plain, 1 spots, 2 stripes
  const eyeColor = Math.floor(hash / 16807) % 2 === 0 ? '#2b2118' : '#3a2a6b';

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={title ?? 'Сгенерированная морда животного'}>
      <rect width="100" height="100" rx="16" fill={bg} />

      {earStyle === 0 && (
        <>
          <circle cx="28" cy="26" r="13" fill={fur} />
          <circle cx="72" cy="26" r="13" fill={fur} />
        </>
      )}
      {earStyle === 1 && (
        <>
          <path d="M22 34 L30 8 L40 32 Z" fill={fur} />
          <path d="M78 34 L70 8 L60 32 Z" fill={fur} />
        </>
      )}
      {earStyle === 2 && (
        <>
          <ellipse cx="24" cy="38" rx="10" ry="18" fill={fur} transform="rotate(-20 24 38)" />
          <ellipse cx="76" cy="38" rx="10" ry="18" fill={fur} transform="rotate(20 76 38)" />
        </>
      )}

      <circle cx="50" cy="52" r="28" fill={fur} />

      {patternStyle === 1 && (
        <g fill={pattern} opacity="0.55">
          <circle cx="36" cy="40" r="3.4" />
          <circle cx="62" cy="38" r="2.8" />
          <circle cx="68" cy="58" r="3.2" />
          <circle cx="32" cy="62" r="2.6" />
          <circle cx="50" cy="68" r="2.8" />
        </g>
      )}
      {patternStyle === 2 && (
        <g stroke={pattern} strokeWidth="3" opacity="0.5">
          <line x1="26" y1="40" x2="34" y2="34" />
          <line x1="28" y1="52" x2="38" y2="48" />
          <line x1="66" y1="34" x2="74" y2="40" />
          <line x1="64" y1="48" x2="74" y2="52" />
        </g>
      )}

      <circle cx="39" cy="50" r="3.4" fill={eyeColor} />
      <circle cx="61" cy="50" r="3.4" fill={eyeColor} />

      <ellipse cx="50" cy="64" rx="7" ry="5" fill={pattern === '#FFFFFF' ? '#2b2118' : pattern} opacity="0.85" />
      <line x1="50" y1="69" x2="50" y2="74" stroke="#2b2118" strokeWidth="1.6" />
      <path d="M50 74 Q42 78 34 75" stroke="#2b2118" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M50 74 Q58 78 66 75" stroke="#2b2118" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
};
