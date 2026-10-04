import { getDeckCards, type DeckId } from '@guess-table/shared';
import { DeckAvatar } from '../DeckAvatar';
import styles from './MySecretCard.module.css';

interface Props {
  deckId: DeckId;
  cardId: string;
}

export const MySecretCard = ({ deckId, cardId }: Props) => {
  const card = getDeckCards(deckId).find((c) => c.id === cardId);
  if (!card) return null;

  return (
    <div className={styles.badge}>
      <span className={styles.avatarWrap}>
        <DeckAvatar deckId={deckId} cardId={card.id} title={card.displayName} />
      </span>
      <div>
        <div className={styles.label}>Ваша карточка</div>
        <div className={styles.name}>{card.displayName}</div>
      </div>
    </div>
  );
};
