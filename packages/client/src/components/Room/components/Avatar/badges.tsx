export type BadgeIcon =
  | 'stethoscope'
  | 'graduationCap'
  | 'flame'
  | 'shield'
  | 'chefHat'
  | 'plane'
  | 'microphone'
  | 'paintbrush'
  | 'pen'
  | 'hardHat'
  | 'camera'
  | 'gavel'
  | 'wrench'
  | 'magnifier'
  | 'scissors'
  | 'trophy'
  | 'bolt'
  | 'paw'
  | 'rocket'
  | 'globe'
  | 'anchor'
  | 'envelope'
  | 'leaf'
  | 'tooth'
  | 'speech'
  | 'ruler'
  | 'flask'
  | 'star'
  | 'musicalNote'
  | 'laptop'
  | 'book'
  | 'knife';

const INK = '#2b2118';

/**
 * Small corner-badge glyphs, one simple hand-drawn shape per profession/theme. Centered
 * on (cx, cy) inside the 16px-radius circle Avatar.tsx draws around it.
 */
export function renderBadge(icon: BadgeIcon, cx: number, cy: number) {
  switch (icon) {
    case 'stethoscope':
      return (
        <g fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round">
          <path d={`M${cx - 6} ${cy - 8} q0 9 6 9 q6 0 6 -9`} />
          <circle cx={cx} cy={cy + 7} r="2.4" fill={INK} stroke="none" />
        </g>
      );
    case 'graduationCap':
      return (
        <g fill={INK}>
          <path d={`M${cx - 9} ${cy - 2} L${cx} ${cy - 7} L${cx + 9} ${cy - 2} L${cx} ${cy + 3} Z`} />
          <line x1={cx + 7} y1={cy - 1} x2={cx + 7} y2={cy + 5} stroke={INK} strokeWidth="1.4" />
        </g>
      );
    case 'flame':
      return (
        <path
          d={`M${cx} ${cy - 9} C${cx + 7} ${cy - 3}, ${cx + 5} ${cy + 7}, ${cx} ${cy + 9} C${cx - 5} ${cy + 7}, ${cx - 7} ${cy - 3}, ${cx} ${cy - 9} Z`}
          fill="#e06a2c"
        />
      );
    case 'shield':
      return (
        <path
          d={`M${cx} ${cy - 9} L${cx + 7} ${cy - 5} L${cx + 7} ${cy + 2} Q${cx} ${cy + 10} ${cx - 7} ${cy + 2} L${cx - 7} ${cy - 5} Z`}
          fill="#577590"
        />
      );
    case 'chefHat':
      return (
        <g fill="#ffffff" stroke={INK} strokeWidth="1.2">
          <rect x={cx - 7} y={cy + 1} width="14" height="7" rx="1.5" />
          <circle cx={cx - 5} cy={cy - 4} r="4.5" />
          <circle cx={cx} cy={cy - 6} r="5" />
          <circle cx={cx + 5} cy={cy - 4} r="4.5" />
        </g>
      );
    case 'plane':
      return <path d={`M${cx - 9} ${cy + 3} L${cx + 9} ${cy - 3} L${cx + 2} ${cy} L${cx + 3} ${cy + 8} L${cx} ${cy + 2} Z`} fill={INK} />;
    case 'microphone':
      return (
        <g fill={INK}>
          <rect x={cx - 3.5} y={cy - 9} width="7" height="12" rx="3.5" />
          <path d={`M${cx - 6} ${cy} a6 6 0 0 0 12 0`} fill="none" stroke={INK} strokeWidth="1.4" />
          <line x1={cx} y1={cy + 6} x2={cx} y2={cy + 9} stroke={INK} strokeWidth="1.4" />
        </g>
      );
    case 'paintbrush':
      return (
        <g>
          <rect x={cx - 1.5} y={cy - 9} width="3" height="10" fill="#8d5524" transform={`rotate(35 ${cx} ${cy})`} />
          <path d={`M${cx - 3} ${cy + 2} L${cx + 3} ${cy + 2} L${cx} ${cy + 9} Z`} fill="#4CC9F0" transform={`rotate(35 ${cx} ${cy})`} />
        </g>
      );
    case 'pen':
      return (
        <g transform={`rotate(35 ${cx} ${cy})`}>
          <rect x={cx - 1.6} y={cy - 9} width="3.2" height="13" fill={INK} />
          <path d={`M${cx - 1.6} ${cy + 4} L${cx + 1.6} ${cy + 4} L${cx} ${cy + 9} Z`} fill={INK} />
        </g>
      );
    case 'hardHat':
      return (
        <g fill="#F2C230" stroke={INK} strokeWidth="1">
          <path d={`M${cx - 8} ${cy + 2} a8 7 0 0 1 16 0 Z`} />
          <rect x={cx - 9} y={cy + 1} width="18" height="3" rx="1.4" />
        </g>
      );
    case 'camera':
      return (
        <g fill={INK}>
          <rect x={cx - 8} y={cy - 4} width="16" height="11" rx="2" />
          <rect x={cx - 3} y={cy - 8} width="6" height="4" rx="1" />
          <circle cx={cx} cy={cy + 1.5} r="3.4" fill="#ffffff" />
        </g>
      );
    case 'gavel':
      return (
        <g stroke={INK} strokeWidth="3" strokeLinecap="round">
          <line x1={cx - 6} y1={cy - 6} x2={cx + 2} y2={cy + 2} />
          <line x1={cx - 8} y1={cy - 2} x2={cx - 2} y2={cy - 8} />
          <line x1={cx + 1} y1={cy + 3} x2={cx + 8} y2={cy + 9} />
        </g>
      );
    case 'wrench':
      return (
        <path
          d={`M${cx - 8} ${cy - 6} a4 4 0 1 0 5 5 l8 8 l3 -3 l-8 -8 a4 4 0 0 0 -8 -2 Z`}
          fill="none"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case 'magnifier':
      return (
        <g fill="none" stroke={INK} strokeWidth="2">
          <circle cx={cx - 2} cy={cy - 2} r="6" />
          <line x1={cx + 3} y1={cy + 3} x2={cx + 8} y2={cy + 8} strokeLinecap="round" />
        </g>
      );
    case 'scissors':
      return (
        <g stroke={INK} strokeWidth="1.6" fill="none">
          <circle cx={cx - 6} cy={cy + 6} r="2.4" />
          <circle cx={cx - 6} cy={cy - 6} r="2.4" />
          <line x1={cx - 4} y1={cy + 5} x2={cx + 8} y2={cy - 7} />
          <line x1={cx - 4} y1={cy - 5} x2={cx + 8} y2={cy + 7} />
        </g>
      );
    case 'trophy':
      return (
        <g fill="#E3B13A">
          <path d={`M${cx - 5} ${cy - 7} h10 v6 a5 5 0 0 1 -10 0 Z`} />
          <rect x={cx - 2.5} y={cy + 1} width="5" height="5" />
          <rect x={cx - 5} y={cy + 6} width="10" height="2.5" rx="1" />
        </g>
      );
    case 'bolt':
      return <path d={`M${cx + 2} ${cy - 9} L${cx - 6} ${cy + 2} L${cx} ${cy + 2} L${cx - 2} ${cy + 9} L${cx + 7} ${cy - 2} L${cx + 1} ${cy - 2} Z`} fill="#F2C230" />;
    case 'paw':
      return (
        <g fill={INK}>
          <ellipse cx={cx} cy={cy + 4} rx="6" ry="4.5" />
          <circle cx={cx - 6} cy={cy - 3} r="2.4" />
          <circle cx={cx - 2} cy={cy - 6} r="2.4" />
          <circle cx={cx + 2} cy={cy - 6} r="2.4" />
          <circle cx={cx + 6} cy={cy - 3} r="2.4" />
        </g>
      );
    case 'rocket':
      return (
        <g fill="#B388EB">
          <path d={`M${cx} ${cy - 9} q6 6 3 15 h-6 q-3 -9 3 -15 Z`} />
          <path d={`M${cx - 3} ${cy + 5} l-4 5 l4 -1 Z`} />
          <path d={`M${cx + 3} ${cy + 5} l4 5 l-4 -1 Z`} />
        </g>
      );
    case 'globe':
      return (
        <g fill="none" stroke={INK} strokeWidth="1.4">
          <circle cx={cx} cy={cy} r="8" />
          <ellipse cx={cx} cy={cy} rx="3.5" ry="8" />
          <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} />
        </g>
      );
    case 'anchor':
      return (
        <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round">
          <circle cx={cx} cy={cy - 7} r="2" fill={INK} stroke="none" />
          <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 7} />
          <path d={`M${cx - 6} ${cy + 2} a6 6 0 0 0 12 0`} />
          <line x1={cx - 5} y1={cy - 1} x2={cx + 5} y2={cy - 1} />
        </g>
      );
    case 'envelope':
      return (
        <g fill="#ffffff" stroke={INK} strokeWidth="1.3">
          <rect x={cx - 8} y={cy - 5} width="16" height="11" rx="1.5" />
          <path d={`M${cx - 8} ${cy - 5} l8 7 l8 -7`} fill="none" />
        </g>
      );
    case 'leaf':
      return (
        <path
          d={`M${cx - 6} ${cy + 7} Q${cx - 8} ${cy - 7} ${cx + 7} ${cy - 8} Q${cx + 6} ${cy + 6} ${cx - 6} ${cy + 7} Z`}
          fill="#6FA35A"
        />
      );
    case 'tooth':
      return (
        <path
          d={`M${cx - 5} ${cy - 7} q-3 6 0 10 q2 3 3 0 q1 3 3 0 q3 -4 0 -10 q-3 -2 -6 0 Z`}
          fill="#ffffff"
          stroke={INK}
          strokeWidth="0.8"
        />
      );
    case 'speech':
      return (
        <g fill={INK}>
          <rect x={cx - 8} y={cy - 6} width="16" height="10" rx="4" />
          <path d={`M${cx - 3} ${cy + 4} l-2 4 l5 -4 Z`} />
        </g>
      );
    case 'ruler':
      return (
        <g transform={`rotate(35 ${cx} ${cy})`}>
          <rect x={cx - 9} y={cy - 2.5} width="18" height="5" fill="#E9C46A" stroke={INK} strokeWidth="0.8" />
          <line x1={cx - 5} y1={cy - 2.5} x2={cx - 5} y2={cy} stroke={INK} strokeWidth="0.8" />
          <line x1={cx} y1={cy - 2.5} x2={cx} y2={cy} stroke={INK} strokeWidth="0.8" />
          <line x1={cx + 5} y1={cy - 2.5} x2={cx + 5} y2={cy} stroke={INK} strokeWidth="0.8" />
        </g>
      );
    case 'flask':
      return (
        <g fill="#8AB17D" stroke={INK} strokeWidth="1">
          <path d={`M${cx - 2.5} ${cy - 9} h5 v6 l5 8 a2 2 0 0 1 -2 3 h-11 a2 2 0 0 1 -2 -3 l5 -8 Z`} />
          <rect x={cx - 3.2} y={cy - 10} width="6.4" height="2" fill={INK} />
        </g>
      );
    case 'star': {
      // Five-pointed "show business" star — marks the Actors deck, computed rather than
      // hand-typed since ten alternating-radius points aren't legible as literal numbers.
      const outer = 8;
      const inner = 3.3;
      const points: string[] = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        points.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
      }
      return <polygon points={points.join(' ')} fill="#E3B13A" stroke={INK} strokeWidth="0.6" />;
    }
    case 'musicalNote':
      return (
        <g fill={INK}>
          <ellipse cx={cx - 4} cy={cy + 6} rx="3.6" ry="2.6" transform={`rotate(-20 ${cx - 4} ${cy + 6})`} />
          <rect x={cx - 1.5} y={cy - 9} width="2" height="15" />
          <path d={`M${cx - 1.5} ${cy - 9} q7 0 7 6 q-4 -2 -7 -1 Z`} />
        </g>
      );
    case 'laptop':
      return (
        <g>
          <rect x={cx - 8} y={cy - 7} width="16" height="10" rx="1" fill="#1C1C1C" />
          <line x1={cx - 5} y1={cy - 4} x2={cx + 1} y2={cy - 4} stroke="#4CC9F0" strokeWidth="1.2" />
          <line x1={cx - 5} y1={cy - 1} x2={cx + 4} y2={cy - 1} stroke="#4CC9F0" strokeWidth="1.2" />
          <rect x={cx - 10} y={cy + 3} width="20" height="2.6" rx="1.3" fill={INK} />
        </g>
      );
    case 'book':
      return (
        <g fill="#ffffff" stroke={INK} strokeWidth="1.2">
          <path d={`M${cx} ${cy - 7} q-8 -3 -9 0 v13 q6 -2 9 1 Z`} />
          <path d={`M${cx} ${cy - 7} q8 -3 9 0 v13 q-6 -2 -9 1 Z`} />
        </g>
      );
    case 'knife':
      return (
        <g transform={`rotate(35 ${cx} ${cy})`}>
          <path d={`M${cx - 9} ${cy} L${cx + 4} ${cy - 3} L${cx + 4} ${cy + 3} Z`} fill="#C9CDD3" stroke={INK} strokeWidth="0.8" />
          <rect x={cx + 3} y={cy - 2} width="7" height="4" rx="1.4" fill="#5C4328" />
        </g>
      );
    default:
      return null;
  }
}
