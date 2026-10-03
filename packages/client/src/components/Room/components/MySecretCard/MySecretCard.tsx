import { CARD_DECK } from '@guess-table/shared';
import { Avatar } from '../Avatar';
import styles from './MySecretCard.module.css';

const CARD_BY_ID = new Map(CARD_DECK.map((card) => [card.id, card]));

interface Props {
  cardId: string;
}

export const MySecretCard = ({ cardId }: Props) => {
  const card = CARD_BY_ID.get(cardId);
  if (!card) return null;

  return (
    <div className={styles.badge}>
      <span className={styles.avatarWrap}>
        <Avatar seed={card.seed} title={card.displayName} />
      </span>
      <div>
        <div className={styles.label}>Ваша карточка</div>
        <div className={styles.name}>{card.displayName}</div>
      </div>
    </div>
  );
};
