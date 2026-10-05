import { DeckId } from '@guess-table/shared';
import { AnimalAvatar } from '../AnimalAvatar';
import { Avatar } from '../Avatar';
import { CardImage } from '../CardImage';
import { MediaAvatar } from '../MediaAvatar';

interface Props {
  deckId: DeckId;
  cardId: string;
  size?: number;
  title?: string;
}

function renderGenerated(deckId: DeckId, cardId: string, size: number | undefined, title: string | undefined) {
  switch (deckId) {
    case DeckId.Animals:
      return <AnimalAvatar cardId={cardId} size={size} title={title} />;
    case DeckId.Movies:
      return <MediaAvatar cardId={cardId} size={size} title={title} variant="movie" />;
    case DeckId.VideoGames:
      return <MediaAvatar cardId={cardId} size={size} title={title} variant="game" />;
    case DeckId.Fictional:
    case DeckId.Celebrities:
    case DeckId.Professions:
    case DeckId.Actors:
    default:
      return <Avatar cardId={cardId} size={size} title={title} />;
  }
}

/**
 * Tries a real photo you dropped into packages/client/public/cards/ first (see that
 * folder's README) and falls back to the generated illustration for the room's deck.
 */
export const DeckAvatar = ({ deckId, cardId, size, title }: Props) => (
  <CardImage cardId={cardId} alt={title ?? 'Карточка'} fallback={renderGenerated(deckId, cardId, size, title)} />
);
