import cx from 'classnames';
import type { Card as CardModel, DeckId } from '@guess-table/shared';
import { DeckAvatar } from '../DeckAvatar';
import styles from './Card.module.css';

interface Props {
  card: CardModel;
  deckId: DeckId;
  excluded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  guessMode?: boolean;
  onClick?: () => void;
}

export const Card = ({ card, deckId, excluded, selected, disabled, guessMode, onClick }: Props) => {
  return (
    <button
      type="button"
      className={cx(styles.card, {
        [styles.excluded]: excluded,
        [styles.selected]: selected,
        [styles.disabled]: disabled,
        [styles.guessTarget]: guessMode,
      })}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      <span className={styles.avatarWrap}>
        <DeckAvatar deckId={deckId} seed={card.seed} title={card.displayName} />
      </span>
      <span className={styles.name}>{card.displayName}</span>
      {excluded && <span className={styles.crossOverlay} aria-hidden="true" />}
    </button>
  );
};
