import { getAnimalDesign, type AnimalExtra } from './animalDesigns';

interface Props {
  cardId: string;
  size?: number;
  title?: string;
}

/**
 * Animal-face SVG rendered from a hand-chosen design per card id (see animalDesigns.ts) —
 * nothing here is derived from a hash. Each animal also gets one defining extra feature
 * (mane/horn/trunk/long neck/shell/beak/wings) picked to actually match the real animal.
 */
export const AnimalAvatar = ({ cardId, size = 96, title }: Props) => {
  const design = getAnimalDesign(cardId);
  const { bg, fur, eyeColor, earStyle, patternStyle, patternColor, extra } = design;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={title ?? 'Иллюстрация животного'}>
      <rect width="100" height="100" rx="16" fill={bg} />

      {extra === 'wings' && (
        <>
          <ellipse cx="14" cy="58" rx="12" ry="20" fill={fur} opacity="0.8" transform="rotate(-20 14 58)" />
          <ellipse cx="86" cy="58" rx="12" ry="20" fill={fur} opacity="0.8" transform="rotate(20 86 58)" />
        </>
      )}

      {extra === 'longNeck' && <rect x="42" y="56" width="16" height="30" rx="6" fill={fur} />}
      {extra === 'shell' && <path d="M14 70 a36 26 0 0 1 72 0 Z" fill={patternColor} opacity="0.9" />}

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

      {extra === 'mane' && (
        <g fill={patternColor}>
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const x = 50 + Math.cos(angle) * 30;
            const y = 52 + Math.sin(angle) * 30;
            return <circle key={i} cx={x} cy={y} r="6" />;
          })}
        </g>
      )}

      <circle cx="50" cy="52" r="26" fill={fur} />

      {patternStyle === 1 && (
        <g fill={patternColor} opacity="0.6">
          <circle cx="36" cy="40" r="3.4" />
          <circle cx="62" cy="38" r="2.8" />
          <circle cx="68" cy="58" r="3.2" />
          <circle cx="32" cy="62" r="2.6" />
          <circle cx="50" cy="68" r="2.8" />
        </g>
      )}
      {patternStyle === 2 && (
        <g stroke={patternColor} strokeWidth="3" opacity="0.55">
          <line x1="26" y1="40" x2="34" y2="34" />
          <line x1="28" y1="52" x2="38" y2="48" />
          <line x1="66" y1="34" x2="74" y2="40" />
          <line x1="64" y1="48" x2="74" y2="52" />
        </g>
      )}

      {extra === 'horn' && <path d="M50 26 L45 40 L55 40 Z" fill={patternColor} />}

      <circle cx="39" cy="50" r="3.4" fill={eyeColor} />
      <circle cx="61" cy="50" r="3.4" fill={eyeColor} />

      {extra === 'beak' ? (
        <path d="M50 58 L62 64 L50 70 Z" fill={patternColor} />
      ) : extra === 'trunk' ? (
        <path d="M50 60 q0 20 10 24" stroke={fur} strokeWidth="9" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <ellipse cx="50" cy="64" rx="7" ry="5" fill={patternColor} opacity="0.85" />
          <line x1="50" y1="69" x2="50" y2="74" stroke="#2b2118" strokeWidth="1.6" />
          <path d="M50 74 Q42 78 34 75" stroke="#2b2118" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M50 74 Q58 78 66 75" stroke="#2b2118" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

export type { AnimalExtra };
