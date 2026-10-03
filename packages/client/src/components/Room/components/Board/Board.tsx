import { useMemo } from 'react';
import { CARD_DECK } from '@guess-table/shared';
import { Card } from '../Card';
import styles from './Board.module.css';

const CARD_BY_ID = new Map(CARD_DECK.map((card) => [card.id, card]));

interface Props {
  boardOrder: string[];
  excludedCardIds: string[];
  ruledOutCardIds: string[];
  selectedCardId?: string | null;
  guessMode?: boolean;
  disabled?: boolean;
  onCardClick: (cardId: string) => void;
}

export const Board = ({
  boardOrder,
  excludedCardIds,
  ruledOutCardIds,
  selectedCardId,
  guessMode,
  disabled,
  onCardClick,
}: Props) => {
  const excludedSet = useMemo(() => new Set(excludedCardIds), [excludedCardIds]);
  const ruledOutSet = useMemo(() => new Set(ruledOutCardIds), [ruledOutCardIds]);

  return (
    <div className={styles.grid}>
      {boardOrder.map((cardId) => {
        const card = CARD_BY_ID.get(cardId);
        if (!card) return null;
        const isRuledOut = ruledOutSet.has(card.id);
        return (
          <Card
            key={card.id}
            card={card}
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
