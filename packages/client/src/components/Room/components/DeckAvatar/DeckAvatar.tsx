import { DeckId } from '@guess-table/shared';
import { AnimalAvatar } from '../AnimalAvatar';
import { Avatar } from '../Avatar';
import { MediaAvatar } from '../MediaAvatar';

interface Props {
  deckId: DeckId;
  seed: string;
  size?: number;
  title?: string;
}

/** Picks the right generated-illustration style for the room's current deck. */
export const DeckAvatar = ({ deckId, seed, size, title }: Props) => {
  switch (deckId) {
    case DeckId.Animals:
      return <AnimalAvatar seed={seed} size={size} title={title} />;
    case DeckId.Movies:
      return <MediaAvatar seed={seed} size={size} title={title} variant="movie" />;
    case DeckId.VideoGames:
      return <MediaAvatar seed={seed} size={size} title={title} variant="game" />;
    case DeckId.Fictional:
    case DeckId.Celebrities:
    case DeckId.Professions:
    default:
      return <Avatar seed={seed} size={size} title={title} />;
  }
};
