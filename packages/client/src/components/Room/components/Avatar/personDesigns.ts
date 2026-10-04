import { indexFromCardId } from '../designHelpers';
import type { BadgeIcon } from './badges';

const BG = ['#F4A261', '#2A9D8F', '#E76F51', '#577590', '#E9C46A', '#8AB17D', '#B388EB', '#FF8FA3', '#4CC9F0', '#FFB4A2'];
const SKIN = ['#FFE0BD', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#FFDAB9'];
const HAIR = ['#2B2118', '#4A2C2A', '#7A4E2D', '#C9A66B', '#1C1C1C', '#8D5B4C', '#D1A3A4'];

export interface PersonDesign {
  bg: string;
  skin: string;
  hair: string;
  hairStyle: 0 | 1 | 2 | 3;
  hasGlasses: boolean;
  mouthUp: boolean;
  badge?: BadgeIcon;
}

/** [bgIdx, skinIdx, hairIdx, hairStyle, hasGlasses, mouthUp, badge?] — hand-picked per card, not computed. */
type Row = [number, number, number, 0 | 1 | 2 | 3, boolean, boolean, BadgeIcon?];

function toDesign([bgIdx, skinIdx, hairIdx, hairStyle, hasGlasses, mouthUp, badge]: Row): PersonDesign {
  return { bg: BG[bgIdx]!, skin: SKIN[skinIdx]!, hair: HAIR[hairIdx]!, hairStyle, hasGlasses, mouthUp, badge };
}

const FALLBACK = toDesign([0, 0, 0, 0, false, true]);

// Order matches FICTIONAL in packages/shared/src/cards.ts. No real-world meaning, so just
// deliberately varied faces — no badges.
const FICTIONAL_ROWS: Row[] = [
  [0, 0, 0, 0, false, true], [7, 1, 6, 1, false, true], [3, 2, 2, 2, true, false], [8, 5, 3, 0, false, true],
  [4, 0, 4, 3, false, false], [6, 3, 1, 1, true, true], [1, 4, 5, 0, false, false], [5, 2, 6, 2, false, true],
  [2, 1, 0, 3, true, false], [9, 0, 2, 1, false, true], [0, 3, 4, 0, true, true], [7, 2, 6, 2, false, false],
  [3, 5, 1, 3, false, true], [8, 0, 3, 0, true, false], [4, 4, 5, 1, false, true], [6, 1, 0, 2, false, false],
  [1, 2, 2, 3, true, true], [5, 0, 6, 0, false, false], [2, 3, 1, 1, false, true], [9, 5, 4, 2, true, false],
  [0, 1, 3, 3, false, true], [7, 0, 5, 0, false, false], [3, 4, 0, 1, true, true], [8, 2, 2, 2, false, false],
  [4, 5, 6, 3, false, true], [6, 0, 1, 0, true, false], [1, 3, 3, 1, false, true], [5, 1, 5, 2, false, false],
  [2, 4, 4, 3, true, true], [9, 0, 0, 0, false, false], [0, 2, 6, 1, false, true], [7, 5, 2, 2, true, false],
  [3, 1, 1, 3, false, true], [8, 4, 3, 0, false, false], [4, 2, 5, 1, true, true], [6, 5, 0, 2, false, false],
  [1, 0, 4, 3, false, true], [5, 3, 6, 0, true, false], [2, 2, 1, 1, false, true], [9, 4, 2, 2, false, false],
  [0, 0, 5, 3, true, true], [7, 3, 3, 0, false, false], [3, 0, 0, 1, false, true], [8, 5, 4, 2, true, false],
  [4, 1, 6, 3, false, true], [6, 2, 2, 0, false, false], [1, 5, 1, 1, true, true], [5, 4, 5, 2, false, false],
  [2, 0, 3, 3, false, true], [9, 3, 6, 0, true, false],
];

// Order matches CELEBRITIES. Long-deceased public figures — hairstyle/badge picked to
// nod at what each is known for (science -> flask, writers -> pen, art -> paintbrush...).
const CELEBRITY_ROWS: Row[] = [
  [3, 1, 3, 3, true, false, 'flask'], [8, 2, 4, 1, false, true, 'paintbrush'], [5, 0, 3, 1, false, false, 'flask'],
  [1, 0, 0, 0, false, false, 'flask'], [6, 3, 4, 2, false, false, 'paw'], [4, 4, 4, 0, false, true, 'bolt'],
  [9, 1, 3, 1, false, true, 'microphone'], [2, 0, 4, 3, false, false, 'microphone'], [7, 2, 4, 2, false, false, 'pen'],
  [0, 0, 4, 3, false, true, 'pen'], [5, 3, 4, 0, false, false, undefined], [3, 2, 4, 2, false, false, 'shield'],
  [8, 1, 0, 0, false, true, 'shield'], [1, 3, 2, 1, false, true, 'globe'], [6, 0, 2, 2, false, false, 'flask'],
  [4, 4, 4, 0, false, true, 'microphone'], [9, 3, 4, 1, false, false, 'paintbrush'], [2, 1, 2, 0, false, false, 'paintbrush'],
  [7, 2, 4, 2, false, false, 'paintbrush'], [0, 0, 3, 0, true, false, 'flask'], [5, 1, 4, 2, true, false, 'speech'],
  [3, 2, 4, 2, false, false, 'pen'], [8, 0, 2, 1, false, true, 'pen'], [1, 3, 2, 1, false, true, 'pen'],
  [6, 1, 3, 0, false, false, 'paintbrush'], [4, 0, 3, 0, false, true, 'globe'], [9, 2, 3, 1, false, false, 'microphone'],
  [2, 3, 4, 2, true, false, 'pen'], [7, 1, 2, 1, false, true, 'pen'], [0, 4, 3, 0, false, false, 'leaf'],
  [5, 0, 4, 0, false, false, 'bolt'], [3, 1, 4, 3, false, true, 'flask'], [8, 2, 3, 0, false, false, 'microphone'],
  [1, 3, 2, 2, false, false, 'pen'], [6, 0, 2, 1, false, true, 'globe'], [4, 1, 2, 1, false, false, 'pen'],
  [9, 4, 3, 0, false, true, 'bolt'], [2, 0, 4, 2, false, false, 'wrench'], [7, 2, 2, 1, false, true, undefined],
  [0, 3, 2, 1, false, false, 'pen'], [5, 1, 3, 0, false, true, 'pen'], [3, 0, 3, 0, false, false, 'pen'],
  [8, 2, 4, 1, true, false, 'pen'], [1, 1, 3, 3, false, false, 'pen'], [6, 3, 4, 0, false, true, 'pen'],
  [4, 0, 2, 1, false, false, 'pen'], [9, 1, 2, 0, false, true, 'pen'], [2, 4, 2, 1, false, false, 'flask'],
  [7, 0, 2, 2, true, false, 'magnifier'], [0, 2, 4, 2, false, false, undefined],
];

// Order matches PROFESSIONS. Badge is the point here — it's what visually names the job.
const PROFESSION_ROWS: Row[] = [
  [1, 0, 0, 0, true, true, 'stethoscope'], [3, 1, 2, 1, true, true, 'graduationCap'], [0, 2, 1, 0, false, false, 'flame'],
  [4, 3, 4, 0, false, false, 'shield'], [8, 0, 3, 2, false, true, 'chefHat'], [2, 1, 1, 1, false, true, 'plane'],
  [6, 4, 2, 3, false, true, 'microphone'], [7, 2, 5, 1, false, true, 'paintbrush'], [5, 0, 0, 0, true, false, 'pen'],
  [9, 3, 4, 2, true, false, 'wrench'], [1, 4, 1, 0, false, false, 'hardHat'], [3, 0, 6, 1, true, true, 'camera'],
  [0, 1, 3, 2, false, true, 'gavel'], [4, 2, 4, 0, true, false, 'gavel'], [8, 3, 1, 1, true, false, 'wrench'],
  [2, 0, 2, 0, false, true, 'anchor'], [6, 1, 5, 1, false, true, 'envelope'], [5, 4, 0, 2, false, false, 'scissors'],
  [9, 2, 3, 0, false, true, 'leaf'], [1, 0, 6, 1, true, false, 'paw'], [7, 3, 4, 0, false, false, 'rocket'],
  [3, 1, 1, 2, true, false, 'magnifier'], [0, 4, 2, 1, false, true, 'magnifier'], [4, 0, 5, 0, false, true, 'leaf'],
  [8, 2, 0, 1, false, false, 'trophy'], [2, 1, 3, 2, true, true, 'tooth'], [6, 3, 4, 0, false, false, 'bolt'],
  [5, 0, 1, 1, true, false, 'wrench'], [9, 4, 2, 0, false, true, 'shield'], [1, 2, 6, 1, false, false, 'globe'],
  [3, 0, 3, 2, false, true, 'speech'], [0, 3, 4, 0, true, false, 'speech'], [4, 1, 1, 1, false, true, 'paintbrush'],
  [8, 4, 2, 0, false, false, 'ruler'], [2, 0, 5, 1, true, true, 'pen'], [6, 2, 0, 2, false, false, 'chefHat'],
  [5, 3, 3, 0, false, true, 'plane'], [9, 1, 4, 1, false, false, 'microphone'], [1, 0, 1, 0, true, true, 'trophy'],
  [7, 4, 6, 1, false, false, 'globe'], [3, 2, 2, 2, false, true, 'chefHat'], [0, 0, 4, 0, true, false, 'wrench'],
  [4, 3, 1, 1, false, false, 'leaf'], [8, 1, 3, 2, false, true, 'hardHat'], [2, 4, 0, 0, true, false, 'wrench'],
  [6, 0, 5, 1, false, true, 'bolt'], [5, 2, 2, 0, false, false, 'hardHat'], [9, 3, 4, 1, true, false, undefined],
  [1, 1, 1, 2, false, true, 'paintbrush'], [7, 0, 3, 0, false, false, 'gavel'],
];

function pickDesign(rows: Row[], cardId: string): PersonDesign {
  const row = rows[indexFromCardId(cardId)];
  return row ? toDesign(row) : FALLBACK;
}

export function getPersonDesign(cardId: string): PersonDesign {
  if (cardId.startsWith('celebrity-')) return pickDesign(CELEBRITY_ROWS, cardId);
  if (cardId.startsWith('profession-')) return pickDesign(PROFESSION_ROWS, cardId);
  return pickDesign(FICTIONAL_ROWS, cardId);
}
