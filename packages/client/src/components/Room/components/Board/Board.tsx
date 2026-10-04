import { useMemo } from 'react';
import { getDeckCards, type DeckId } from '@guess-table/shared';
import { Card } from '../Card';
import styles from './Board.module.css';

interface Props {
  deckId: DeckId;
  boardOrder: string[];
  excludedCardIds: string[];
  ruledOutCardIds: string[];
  selectedCardId?: string | null;
  guessMode?: boolean;
  disabled?: boolean;
  onCardClick: (cardId: string) => void;
}

export const Board = ({
  deckId,
  boardOrder,
  excludedCardIds,
  ruledOutCardIds,
  selectedCardId,
  guessMode,
  disabled,
  onCardClick,
}: Props) => {
  const cardById = useMemo(() => new Map(getDeckCards(deckId).map((card) => [card.id, card])), [deckId]);
  const excludedSet = useMemo(() => new Set(excludedCardIds), [excludedCardIds]);
  const ruledOutSet = useMemo(() => new Set(ruledOutCardIds), [ruledOutCardIds]);

  return (
    <div className={styles.grid}>
      {boardOrder.map((cardId) => {
        const card = cardById.get(cardId);
        if (!card) return null;
        const isRuledOut = ruledOutSet.has(card.id);
        return (
          <Card
            key={card.id}
            card={card}
            deckId={deckId}
            excluded={isRuledOut || excludedSet.has(card.id)}
            selected={selectedCardId === card.id}
            guessMode={guessMode}
            disabled={disabled || isRuledOut}
            onClick={() => onCardClick(card.id)}
          />
        );
      })}
    </div>
  );
};
