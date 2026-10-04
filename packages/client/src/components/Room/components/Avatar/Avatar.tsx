import { hashSeed } from '../avatarHash';

const BG_COLORS = ['#F4A261', '#2A9D8F', '#E76F51', '#577590', '#E9C46A', '#8AB17D', '#B388EB', '#FF8FA3', '#4CC9F0', '#FFB4A2'];
const HAIR_COLORS = ['#2B2118', '#4A2C2A', '#7A4E2D', '#C9A66B', '#1C1C1C', '#8D5B4C', '#D1A3A4'];
const SKIN_COLORS = ['#FFE0BD', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#FFDAB9'];

interface Props {
  seed: string;
  size?: number;
  title?: string;
}

/**
 * Deterministic, fictional SVG portrait generated from `seed` — no external images,
 * so the card deck needs no licensed photos. Same seed always renders the same face.
 */
export const Avatar = ({ seed, size = 96, title }: Props) => {
  const hash = hashSeed(seed);
  const bg = BG_COLORS[hash % BG_COLORS.length];
  const skin = SKIN_COLORS[Math.floor(hash / 7) % SKIN_COLORS.length];
  const hair = HAIR_COLORS[Math.floor(hash / 49) % HAIR_COLORS.length];
  const hairStyle = Math.floor(hash / 343) % 4;
  const hasGlasses = Math.floor(hash / 2401) % 3 === 0;
  const mouthUp = Math.floor(hash / 16807) % 2 === 0;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={title ?? 'Сгенерированный портрет'}>
      <rect width="100" height="100" rx="16" fill={bg} />
      <ellipse cx="50" cy="98" rx="34" ry="18" fill={hair} opacity="0.85" />
      {hairStyle === 1 && <ellipse cx="50" cy="48" rx="29" ry="33" fill={hair} />}
      <circle cx="50" cy="46" r="23" fill={skin} />
      {hairStyle === 0 && <path d="M27 42 a23 23 0 0 1 46 0 v-8 a23 19 0 0 0 -46 0 z" fill={hair} />}
      {hairStyle === 3 && (
        <>
          <circle cx="31" cy="31" r="8" fill={hair} />
          <circle cx="41" cy="23" r="9" fill={hair} />
          <circle cx="53" cy="21" r="9" fill={hair} />
          <circle cx="64" cy="25" r="8" fill={hair} />
          <circle cx="70" cy="35" r="7" fill={hair} />
        </>
      )}
      <circle cx="42" cy="46" r="2.6" fill="#2b2118" />
      <circle cx="58" cy="46" r="2.6" fill="#2b2118" />
      {hasGlasses && (
        <g stroke="#2b2118" strokeWidth="2" fill="none">
          <rect x="34" y="41" width="14" height="10" rx="3" />
          <rect x="52" y="41" width="14" height="10" rx="3" />
          <line x1="48" y1="45" x2="52" y2="45" />
        </g>
      )}
      {mouthUp ? (
        <path d="M42 58 Q50 64 58 58" stroke="#8a4a3a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      ) : (
        <line x1="43" y1="59" x2="57" y2="59" stroke="#8a4a3a" strokeWidth="2.4" strokeLinecap="round" />
      )}
    </svg>
  );
};
