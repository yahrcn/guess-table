import { getPersonDesign } from './personDesigns';
import { renderBadge } from './badges';

interface Props {
  cardId: string;
  size?: number;
  title?: string;
}

/**
 * Person-face SVG rendered from a hand-chosen design per card id (see personDesigns.ts) —
 * nothing here is derived from hashing a seed. The optional corner badge ties the face to
 * its specific role (stethoscope for a doctor, flask for a scientist, etc).
 */
export const Avatar = ({ cardId, size = 96, title }: Props) => {
  const { bg, skin, hair, hairStyle, hasGlasses, mouthUp, badge } = getPersonDesign(cardId);

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
      {badge && (
        <g>
          <circle cx="78" cy="80" r="16" fill="#ffffff" stroke="#2b2118" strokeWidth="1.5" />
          {renderBadge(badge, 78, 80)}
        </g>
      )}
    </svg>
  );
};
