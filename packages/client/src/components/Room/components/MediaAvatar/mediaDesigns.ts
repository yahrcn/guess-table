import { indexFromCardId } from '../designHelpers';
import type { MediaIcon } from './mediaIcons';

const BG = ['#1D2B53', '#7A1F3D', '#2E3A1F', '#3A1F4D', '#1F3A3A', '#4D2E1F', '#1F2E4D'];
const ACCENT = ['#F4A261', '#4CC9F0', '#F72585', '#8AB17D', '#FFD166', '#B388EB', '#FF8FA3'];

export interface MediaDesign {
  bg: string;
  accent: string;
  icon: MediaIcon;
}

/** [bgIdx, accentIdx, icon] — icon picked by hand per title's genre/subject, not computed. */
type Row = [number, number, MediaIcon];

function toDesign([bgIdx, accentIdx, icon]: Row): MediaDesign {
  return { bg: BG[bgIdx]!, accent: ACCENT[accentIdx]!, icon };
}

const FALLBACK = toDesign([0, 0, 'star']);

// Order matches MOVIES in packages/shared/src/cards.ts.
const MOVIE_ROWS: Row[] = [
  [0, 1, 'ship'], [1, 4, 'bolt'], [2, 4, 'crown'], [3, 0, 'mask'], [4, 2, 'heart'],
  [5, 3, 'skull'], [6, 1, 'star'], [0, 5, 'ring'], [1, 3, 'sword'], [2, 6, 'mask'],
  [3, 1, 'mask'], [4, 3, 'skull'], [5, 1, 'ghost'], [6, 2, 'mask'], [0, 2, 'heart'],
  [1, 4, 'star'], [2, 1, 'ship'], [3, 2, 'heart'], [4, 4, 'crown'], [5, 4, 'coin'],
  [6, 0, 'mask'], [0, 6, 'heart'], [1, 2, 'heart'], [2, 0, 'mask'], [3, 3, 'mask'],
  [4, 1, 'car'], [5, 5, 'ghost'], [6, 4, 'crown'], [0, 3, 'star'], [1, 4, 'coin'],
  [2, 3, 'sword'], [3, 5, 'potion'], [4, 1, 'star'], [5, 4, 'star'], [6, 2, 'heart'],
  [0, 6, 'heart'], [1, 2, 'heart'], [2, 0, 'mask'], [3, 6, 'heart'], [4, 0, 'mask'],
  [5, 3, 'sword'], [6, 1, 'mask'], [0, 5, 'ghost'], [1, 1, 'ring'], [2, 4, 'crown'],
  [3, 2, 'heart'], [4, 4, 'crown'], [5, 3, 'sword'], [6, 6, 'heart'], [0, 3, 'skull'],
];

// Order matches VIDEO_GAMES in packages/shared/src/cards.ts.
const GAME_ROWS: Row[] = [
  [1, 1, 'block'], [2, 4, 'star'], [3, 2, 'ball'], [4, 4, 'ball'], [5, 3, 'block'],
  [6, 3, 'sword'], [0, 1, 'sword'], [1, 2, 'sword'], [2, 1, 'crosshair'], [3, 3, 'sword'],
  [4, 3, 'skull'], [5, 1, 'ring'], [6, 2, 'crosshair'], [0, 4, 'block'], [1, 4, 'crown'],
  [2, 3, 'star'], [3, 1, 'ghost'], [4, 4, 'car'], [5, 3, 'skull'], [6, 1, 'sword'],
  [0, 3, 'crosshair'], [1, 1, 'crosshair'], [2, 2, 'sword'], [3, 4, 'ball'], [4, 2, 'ball'],
  [5, 3, 'skull'], [6, 1, 'skull'], [0, 4, 'star'], [1, 4, 'car'], [2, 3, 'ball'],
  [3, 1, 'crosshair'], [4, 3, 'crosshair'], [5, 2, 'heart'], [6, 3, 'sword'], [0, 1, 'crosshair'],
  [1, 5, 'bolt'], [2, 3, 'sword'], [3, 4, 'star'], [4, 2, 'heart'], [5, 4, 'block'],
  [6, 1, 'ball'], [0, 3, 'skull'], [1, 1, 'ghost'], [2, 3, 'skull'], [3, 5, 'bolt'],
  [4, 4, 'star'], [5, 4, 'crown'], [6, 3, 'block'], [0, 1, 'sword'], [1, 5, 'potion'],
];

function pickDesign(rows: Row[], cardId: string): MediaDesign {
  const row = rows[indexFromCardId(cardId)];
  return row ? toDesign(row) : FALLBACK;
}

export function getMediaDesign(deckKind: 'movie' | 'game', cardId: string): MediaDesign {
  return pickDesign(deckKind === 'movie' ? MOVIE_ROWS : GAME_ROWS, cardId);
}
