import cx from 'classnames';
import { useNavigate } from 'react-router-dom';
import { CARD_DECK, type PlayerView } from '@guess-table/shared';
import { useAppDispatch } from '../../../../config/hooks';
import { Button } from '../../../../shared/components/Button';
import { roomActions } from '../../slice';
import { Avatar } from '../Avatar';
import styles from './FinishedBanner.module.css';

const CARD_BY_ID = new Map(CARD_DECK.map((card) => [card.id, card]));

interface Props {
  winnerId: string | null;
  revealedSecrets: Record<string, string> | null;
  players: PlayerView[];
  myPlayerId: string | null;
  rematchReadyPlayerIds: string[];
  isSubmitting: boolean;
  actionError: string | null;
}

export const FinishedBanner = ({
  winnerId,
  revealedSecrets,
  players,
  myPlayerId,
  rematchReadyPlayerIds,
  isSubmitting,
  actionError,
}: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const iWon = winnerId === myPlayerId;

  const iAmReadyForRematch = Boolean(myPlayerId && rematchReadyPlayerIds.includes(myPlayerId));
  const opponent = players.find((player) => player.id !== myPlayerId);
  const isOpponentReadyForRematch = Boolean(opponent && rematchReadyPlayerIds.includes(opponent.id));

  const handleRematch = () => {
    if (iAmReadyForRematch || isSubmitting) return;
    dispatch(roomActions.rematchBegin());
  };

  return (
    <div className={styles.banner}>
      <div className={cx(styles.title, iWon ? styles.win : styles.lose)}>{iWon ? 'Вы победили!' : 'Вы проиграли'}</div>
      <div className={styles.reason}>
        {iWon ? 'Вы угадали карточку соперника.' : 'Соперник угадал вашу карточку.'}
      </div>
      {revealedSecrets && (
        <div className={styles.secrets}>
          {players.map((player) => {
            const cardId = revealedSecrets[player.id];
            const card = cardId ? CARD_BY_ID.get(cardId) : undefined;
            if (!card) return null;
            return (
              <div key={player.id} className={styles.secretCol}>
                <Avatar seed={card.seed} size={64} title={card.displayName} />
                <span>
                  {player.name}: {card.displayName}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {isOpponentReadyForRematch && !iAmReadyForRematch && (
        <div className={styles.hint}>Соперник готов сыграть ещё раз</div>
      )}
      {actionError && <div className={styles.error}>{actionError}</div>}

      <div className={styles.actions}>
        <Button onClick={handleRematch} disabled={iAmReadyForRematch || isSubmitting}>
          {iAmReadyForRematch ? 'Ждём соперника…' : 'Сыграть ещё'}
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          На главную
        </Button>
      </div>
    </div>
  );
};
