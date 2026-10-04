import cx from 'classnames';
import { DECK_LABELS, DeckId } from '@guess-table/shared';
import { useAppDispatch } from '../../../../config/hooks';
import { roomActions } from '../../slice';
import styles from './DeckPicker.module.css';

const DECK_IDS = Object.values(DeckId);

interface Props {
  selectedDeckId: DeckId;
  isSubmitting: boolean;
}

export const DeckPicker = ({ selectedDeckId, isSubmitting }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.picker}>
      <div className={styles.label}>Набор карточек</div>
      <div className={styles.options}>
        {DECK_IDS.map((deckId) => (
          <button
            key={deckId}
            type="button"
            className={cx(styles.option, { [styles.active]: deckId === selectedDeckId })}
            disabled={isSubmitting}
            onClick={() => dispatch(roomActions.selectDeckBegin({ deckId }))}
          >
            {DECK_LABELS[deckId]}
          </button>
        ))}
      </div>
    </div>
  );
};
