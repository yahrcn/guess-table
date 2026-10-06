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
  [0, 1, 'ship'], [1, 4, 'bolt'], [2, 4, 'crown'], [3, 0, 'key'], [4, 2, 'heart'],
  [5, 3, 'skull'], [6, 1, 'star'], [0, 5, 'ring'], [1, 3, 'sword'], [2, 6, 'crown'],
  [3, 1, 'mask'], [4, 3, 'skull'], [5, 1, 'ghost'], [6, 2, 'mask'], [0, 2, 'heart'],
  [1, 4, 'bolt'], [2, 1, 'ship'], [3, 2, 'heart'], [4, 4, 'crown'], [5, 4, 'coin'],
  [6, 0, 'mask'], [0, 6, 'heart'], [1, 2, 'heart'], [2, 0, 'mask'], [3, 3, 'mask'],
  [4, 1, 'car'], [5, 5, 'crown'], [6, 4, 'heart'], [0, 3, 'skull'], [1, 4, 'magnifier'],
  [2, 3, 'ring'], [3, 5, 'potion'], [4, 1, 'star'], [5, 4, 'flask'], [6, 2, 'ghost'],
  [0, 6, 'star'], [1, 2, 'potion'], [2, 0, 'mask'], [3, 6, 'crown'], [4, 0, 'bolt'],
  [5, 3, 'coin'], [6, 1, 'chefHat'], [0, 5, 'ball'], [1, 1, 'sword'], [2, 4, 'sword'],
  [3, 2, 'crosshair'], [4, 4, 'skull'], [5, 3, 'heart'], [6, 6, 'skull'], [0, 3, 'skull'],
];

// Order matches VIDEO_GAMES in packages/shared/src/cards.ts.
const GAME_ROWS: Row[] = [
  [1, 1, 'block'], [2, 4, 'star'], [3, 2, 'ball'], [4, 4, 'ball'], [5, 3, 'block'],
  [6, 3, 'crosshair'], [0, 1, 'sword'], [1, 2, 'sword'], [2, 1, 'crosshair'], [3, 3, 'sword'],
  [4, 3, 'skull'], [5, 1, 'ring'], [6, 2, 'crosshair'], [0, 4, 'block'], [1, 4, 'crown'],
  [2, 3, 'star'], [3, 1, 'ghost'], [4, 4, 'car'], [5, 3, 'skull'], [6, 1, 'ring'],
  [0, 3, 'crosshair'], [1, 1, 'crosshair'], [2, 2, 'sword'], [3, 4, 'ball'], [4, 2, 'ball'],
  [5, 3, 'skull'], [6, 1, 'skull'], [0, 4, 'star'], [1, 4, 'car'], [2, 3, 'ball'],
  [3, 1, 'crosshair'], [4, 3, 'crosshair'], [5, 2, 'heart'], [6, 3, 'sword'], [0, 1, 'crosshair'],
  [1, 5, 'bolt'], [2, 3, 'sword'], [3, 4, 'star'], [4, 2, 'heart'], [5, 4, 'block'],
  [6, 1, 'skull'], [0, 3, 'skull'], [1, 1, 'ghost'], [2, 3, 'skull'], [3, 5, 'bolt'],
  [4, 4, 'star'], [5, 4, 'crown'], [6, 3, 'block'], [0, 1, 'sword'], [1, 5, 'potion'],
];

// Order matches DISHES in packages/shared/src/cards.ts.
const DISH_ROWS: Row[] = [
  [0, 3, 'bowl'], [1, 5, 'bread'], [2, 0, 'bread'], [3, 2, 'sword'], [4, 4, 'bowl'],
  [5, 6, 'bowl'], [6, 1, 'pizza'], [0, 3, 'noodles'], [1, 5, 'block'], [2, 0, 'block'],
  [3, 2, 'pizza'], [4, 4, 'pizza'], [5, 6, 'pizza'], [6, 1, 'bread'], [0, 3, 'bread'],
  [1, 5, 'bowl'], [2, 0, 'bowl'], [3, 2, 'bowl'], [4, 4, 'bowl'], [5, 6, 'bread'],
  [6, 1, 'bread'], [0, 3, 'bread'], [1, 5, 'bowl'], [2, 0, 'noodles'], [3, 2, 'bowl'],
  [4, 4, 'pizza'], [5, 6, 'pizza'], [6, 1, 'pizza'], [0, 3, 'noodles'], [1, 5, 'bowl'],
  [2, 0, 'bowl'], [3, 2, 'pizza'], [4, 4, 'bowl'], [5, 6, 'bowl'], [6, 1, 'bread'],
  [0, 3, 'bowl'], [1, 5, 'bread'], [2, 0, 'bread'], [3, 2, 'bowl'], [4, 4, 'bowl'],
  [5, 6, 'bowl'], [6, 1, 'bowl'], [0, 3, 'cup'], [1, 5, 'cup'], [2, 0, 'cup'],
  [3, 2, 'cup'], [4, 4, 'cup'], [5, 6, 'pizza'], [6, 1, 'bowl'], [0, 3, 'pizza'],
];

// Order matches CLOTHING in packages/shared/src/cards.ts.
const CLOTHING_ROWS: Row[] = [
  [0, 3, 'shirt'], [1, 5, 'shirt'], [2, 0, 'dress'], [3, 2, 'shirt'], [4, 4, 'shirt'],
  [5, 6, 'shirt'], [6, 1, 'shirt'], [0, 3, 'shirt'], [1, 5, 'shirt'], [2, 0, 'dress'],
  [3, 2, 'shirt'], [4, 4, 'shirt'], [5, 6, 'shirt'], [6, 1, 'shirt'], [0, 3, 'shirt'],
  [1, 5, 'dress'], [2, 0, 'shirt'], [3, 2, 'shirt'], [4, 4, 'shirt'], [5, 6, 'shirt'],
  [6, 1, 'dress'], [0, 3, 'hat'], [1, 5, 'hat'], [2, 0, 'hat'], [3, 2, 'hat'],
  [4, 4, 'hat'], [5, 6, 'bag'], [6, 1, 'bag'], [0, 3, 'bag'], [1, 5, 'bag'],
  [2, 0, 'shoe'], [3, 2, 'shoe'], [4, 4, 'shoe'], [5, 6, 'shoe'], [6, 1, 'shoe'],
  [0, 3, 'shoe'], [1, 5, 'shoe'], [2, 0, 'bag'], [3, 2, 'bag'], [4, 4, 'bag'],
  [5, 6, 'bag'], [6, 1, 'bag'], [0, 3, 'hat'], [1, 5, 'dress'], [2, 0, 'shirt'],
  [3, 2, 'shirt'], [4, 4, 'shirt'], [5, 6, 'shirt'], [6, 1, 'bag'], [0, 3, 'hat'],
];

// Order matches SOCIAL_NETWORKS in packages/shared/src/cards.ts.
const SOCIAL_ROWS: Row[] = [
  [0, 3, 'globe'], [1, 5, 'globe'], [2, 0, 'chat'], [3, 2, 'chat'], [4, 4, 'camera'],
  [5, 6, 'globe'], [6, 1, 'globe'], [0, 3, 'play'], [1, 5, 'play'], [2, 0, 'camera'],
  [3, 2, 'globe'], [4, 4, 'globe'], [5, 6, 'camera'], [6, 1, 'chat'], [0, 3, 'chat'],
  [1, 5, 'chat'], [2, 0, 'chat'], [3, 2, 'chat'], [4, 4, 'globe'], [5, 6, 'globe'],
  [6, 1, 'play'], [0, 3, 'play'], [1, 5, 'globe'], [2, 0, 'chat'], [3, 2, 'chat'],
  [4, 4, 'play'], [5, 6, 'globe'], [6, 1, 'globe'], [0, 3, 'chat'], [1, 5, 'chat'],
  [2, 0, 'camera'], [3, 2, 'globe'], [4, 4, 'camera'], [5, 6, 'globe'], [6, 1, 'globe'],
  [0, 3, 'play'], [1, 5, 'play'], [2, 0, 'globe'], [3, 2, 'globe'], [4, 4, 'chat'],
  [5, 6, 'chat'], [6, 1, 'chat'], [0, 3, 'chat'], [1, 5, 'chat'], [2, 0, 'chat'],
  [3, 2, 'chat'], [4, 4, 'play'], [5, 6, 'play'], [6, 1, 'globe'], [0, 3, 'chat'],
];

// Order matches ANIME in packages/shared/src/cards.ts.
const ANIME_ROWS: Row[] = [
  [0, 3, 'sword'], [1, 5, 'sword'], [2, 0, 'ship'], [3, 2, 'crosshair'], [4, 4, 'skull'],
  [5, 6, 'potion'], [6, 1, 'sword'], [0, 3, 'star'], [1, 5, 'crown'], [2, 0, 'star'],
  [3, 2, 'skull'], [4, 4, 'potion'], [5, 6, 'crosshair'], [6, 1, 'crown'], [0, 3, 'heart'],
  [1, 5, 'ghost'], [2, 0, 'crown'], [3, 2, 'heart'], [4, 4, 'star'], [5, 6, 'ball'],
  [6, 1, 'ball'], [0, 3, 'crosshair'], [1, 5, 'sword'], [2, 0, 'ball'], [3, 2, 'ball'],
  [4, 4, 'potion'], [5, 6, 'sword'], [6, 1, 'flask'], [0, 3, 'sword'], [1, 5, 'crosshair'],
  [2, 0, 'ring'], [3, 2, 'crown'], [4, 4, 'potion'], [5, 6, 'sword'], [6, 1, 'sword'],
  [0, 3, 'sword'], [1, 5, 'crosshair'], [2, 0, 'star'], [3, 2, 'crosshair'], [4, 4, 'star'],
  [5, 6, 'bolt'], [6, 1, 'ghost'], [0, 3, 'sword'], [1, 5, 'sword'], [2, 0, 'chefHat'],
  [3, 2, 'skull'], [4, 4, 'crosshair'], [5, 6, 'star'], [6, 1, 'heart'], [0, 3, 'heart'],
];

// Order matches BRANDS in packages/shared/src/cards.ts.
const BRAND_ROWS: Row[] = [
  [0, 3, 'shoe'], [1, 5, 'shoe'], [2, 0, 'laptop'], [3, 2, 'laptop'], [4, 4, 'cup'],
  [5, 6, 'cup'], [6, 1, 'pizza'], [0, 3, 'pizza'], [1, 5, 'cup'], [2, 0, 'bag'],
  [3, 2, 'dress'], [4, 4, 'shirt'], [5, 6, 'bag'], [6, 1, 'bag'], [0, 3, 'bag'],
  [1, 5, 'car'], [2, 0, 'car'], [3, 2, 'car'], [4, 4, 'car'], [5, 6, 'car'],
  [6, 1, 'laptop'], [0, 3, 'block'], [1, 5, 'star'], [2, 0, 'play'], [3, 2, 'bag'],
  [4, 4, 'globe'], [5, 6, 'laptop'], [6, 1, 'laptop'], [0, 3, 'laptop'], [1, 5, 'laptop'],
  [2, 0, 'laptop'], [3, 2, 'bag'], [4, 4, 'bag'], [5, 6, 'bag'], [6, 1, 'shoe'],
  [0, 3, 'shoe'], [1, 5, 'shirt'], [2, 0, 'bag'], [3, 2, 'bag'], [4, 4, 'cup'],
  [5, 6, 'pizza'], [6, 1, 'cup'], [0, 3, 'cup'], [1, 5, 'bread'], [2, 0, 'noodles'],
  [3, 2, 'cup'], [4, 4, 'cup'], [5, 6, 'cup'], [6, 1, 'bag'], [0, 3, 'bag'],
];

function pickDesign(rows: Row[], cardId: string): MediaDesign {
  const row = rows[indexFromCardId(cardId)];
  return row ? toDesign(row) : FALLBACK;
}

export type MediaDeckKind = 'movie' | 'game' | 'dish' | 'clothing' | 'social' | 'anime' | 'brand';

const ROWS_BY_KIND: Record<MediaDeckKind, Row[]> = {
  movie: MOVIE_ROWS,
  game: GAME_ROWS,
  dish: DISH_ROWS,
  clothing: CLOTHING_ROWS,
  social: SOCIAL_ROWS,
  anime: ANIME_ROWS,
  brand: BRAND_ROWS,
};

export function getMediaDesign(deckKind: MediaDeckKind, cardId: string): MediaDesign {
  return pickDesign(ROWS_BY_KIND[deckKind], cardId);
}
