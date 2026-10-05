import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Phase } from '@guess-table/shared';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { loadPlayerName, loadSession } from '../../shared/helpers/storageHelpers';
import { AsyncStatus } from '../../shared/types';
import { Button } from '../../shared/components/Button';
import { Board } from './components/Board';
import { DeckPicker } from './components/DeckPicker';
import { FinishedBanner } from './components/FinishedBanner';
import { MySecretCard } from './components/MySecretCard';
import { PlayersHeader } from './components/PlayersHeader';
import { QuestionLog } from './components/QuestionLog';
import { QuestionPanel } from './components/QuestionPanel';
import { selectRoomViewModel } from './selectors/viewSelectors';
import { roomActions } from './slice';
import styles from './Room.module.css';

interface Props {
  roomId: string;
}

export const Room = ({ roomId }: Props) => {
  const dispatch = useAppDispatch();
  const {
    snapshot,
    joinStatus,
    joinError,
    isSubmitting,
    actionError,
    guessMode,
    excludedCardIds,
    ruledOutCardIds,
    myPlayerId,
    pendingQuestion,
    isMyTurn,
    isPendingQuestionMine,
    haveSelectedSecret,
    isAppealLocked,
  } = useAppSelector(selectRoomViewModel);

  const knownName = loadSession(roomId)?.playerName || loadPlayerName();
  // Uncommitted form input — not business state, doesn't need to live in redux.
  const [nameInput, setNameInput] = useState(knownName);

  // Guards against React StrictMode's dev-only double-invoke of effects: without it,
  // a brand-new player (no token yet) would fire two real join requests — the first
  // fills the room, the second then bounces off it as "full" and overwrites the result.
  const autoJoinedRoomIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (knownName && autoJoinedRoomIdRef.current !== roomId) {
      autoJoinedRoomIdRef.current = roomId;
      dispatch(roomActions.joinRoomBegin({ roomId, playerName: knownName }));
    }
    // Only re-run when the room changes, not on every keystroke of nameInput.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const handleNameSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    dispatch(roomActions.joinRoomBegin({ roomId, playerName: trimmed }));
  };

  const handleCardClick = (cardId: string) => {
    if (!snapshot || ruledOutCardIds.includes(cardId)) return;

    if (snapshot.phase === Phase.Selecting) {
      if (snapshot.mySecretCardId) return;
      dispatch(roomActions.selectSecretBegin({ cardId }));
      return;
    }

    if (snapshot.phase === Phase.Playing && guessMode) {
      dispatch(roomActions.finalGuessBegin({ cardId }));
      return;
    }

    if (snapshot.phase === Phase.Playing || snapshot.phase === Phase.Finished) {
      dispatch(roomActions.cardExclusionToggled({ cardId }));
    }
  };

  if (!knownName && joinStatus === AsyncStatus.Idle) {
    return (
      <div className={styles.centerPage}>
        <form className={styles.nameForm} onSubmit={handleNameSubmit}>
          <h2>Войти в комнату</h2>
          <input
            autoFocus
            placeholder="Ваше имя"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            maxLength={30}
          />
          <Button type="submit" disabled={!nameInput.trim()}>
            Войти
          </Button>
        </form>
      </div>
    );
  }

  if (joinStatus === AsyncStatus.Pending || joinStatus === AsyncStatus.Idle) {
    return <div className={styles.centerPage}>Подключаемся…</div>;
  }

  if (joinStatus === AsyncStatus.Failed || !snapshot) {
    return (
      <div className={styles.centerPage}>
        <p className={styles.error}>{joinError ?? 'Не удалось подключиться к комнате.'}</p>
        <Button onClick={() => window.location.assign('/')}>На главную</Button>
      </div>
    );
  }

  const waitingForOpponent = snapshot.phase === Phase.Lobby;
  const selectingPhase = snapshot.phase === Phase.Selecting;

  return (
    <div className={styles.page}>
      <PlayersHeader
        players={snapshot.players}
        myPlayerId={myPlayerId}
        currentTurnPlayerId={snapshot.currentTurnPlayerId}
        showTurn={snapshot.phase === Phase.Playing}
      />

      {snapshot.mySecretCardId && <MySecretCard deckId={snapshot.deckId} cardId={snapshot.mySecretCardId} />}

      {waitingForOpponent && (
        <>
          <div className={styles.notice}>Ожидаем второго игрока — поделитесь ссылкой на комнату.</div>
          {actionError && <div className={styles.errorNotice}>{actionError}</div>}
          <DeckPicker selectedDeckId={snapshot.deckId} isSubmitting={isSubmitting} />
          <Button
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => dispatch(roomActions.leaveLobbyBegin())}
          >
            Выйти из лобби
          </Button>
        </>
      )}

      {selectingPhase && (
        <div className={styles.notice}>
          {haveSelectedSecret ? 'Вы загадали карточку, ждём соперника…' : 'Выберите карточку, которую загадываете.'}
        </div>
      )}
      {selectingPhase && actionError && <div className={styles.errorNotice}>{actionError}</div>}

      {snapshot.phase === Phase.Finished && (
        <FinishedBanner
          deckId={snapshot.deckId}
          winnerId={snapshot.winnerId}
          revealedSecrets={snapshot.revealedSecrets}
          players={snapshot.players}
          myPlayerId={myPlayerId}
          rematchReadyPlayerIds={snapshot.rematchReadyPlayerIds}
          isSubmitting={isSubmitting}
          actionError={actionError}
        />
      )}

      <div className={styles.layout}>
        <Board
          deckId={snapshot.deckId}
          boardOrder={snapshot.boardOrder}
          excludedCardIds={excludedCardIds}
          ruledOutCardIds={ruledOutCardIds}
          selectedCardId={selectingPhase ? snapshot.mySecretCardId : null}
          guessMode={guessMode}
          disabled={waitingForOpponent || (selectingPhase && haveSelectedSecret) || snapshot.phase === Phase.Finished}
          onCardClick={handleCardClick}
        />

        {snapshot.phase === Phase.Playing && (
          <div className={styles.sidebar}>
            <QuestionPanel
              isMyTurn={isMyTurn}
              pendingQuestion={pendingQuestion}
              isPendingQuestionMine={isPendingQuestionMine}
              isAppealLocked={isAppealLocked}
              guessMode={guessMode}
              isSubmitting={isSubmitting}
              actionError={actionError}
            />
            <QuestionLog
              deckId={snapshot.deckId}
              questions={snapshot.questions}
              finalGuesses={snapshot.finalGuesses}
              players={snapshot.players}
            />
          </div>
        )}
      </div>
    </div>
  );
};
