import cx from 'classnames';
import { useState, type FormEvent } from 'react';
import { AppealReason, APPEAL_REASON_LABELS, type QuestionEntry } from '@guess-table/shared';
import { useAppDispatch } from '../../../../config/hooks';
import { Button } from '../../../../shared/components/Button';
import { roomActions } from '../../slice';
import styles from './QuestionPanel.module.css';

const APPEAL_REASONS = Object.values(AppealReason);

interface Props {
  isMyTurn: boolean;
  pendingQuestion: QuestionEntry | null;
  isPendingQuestionMine: boolean;
  isAppealLocked: boolean;
  guessMode: boolean;
  isSubmitting: boolean;
  actionError: string | null;
}

export const QuestionPanel = ({
  isMyTurn,
  pendingQuestion,
  isPendingQuestionMine,
  isAppealLocked,
  guessMode,
  isSubmitting,
  actionError,
}: Props) => {
  const dispatch = useAppDispatch();
  // Uncommitted form input — not business state, doesn't need to live in redux.
  const [text, setText] = useState('');
  // Transient UI toggle for the reason picker — not business state either.
  const [showAppealReasons, setShowAppealReasons] = useState(false);

  const isRecipient = Boolean(pendingQuestion) && !isPendingQuestionMine;
  const canAsk = isMyTurn && !pendingQuestion;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    dispatch(roomActions.askQuestionBegin({ text: trimmed }));
    setText('');
  };

  const handleAnswer = (answer: boolean) => {
    if (!pendingQuestion || isSubmitting) return;
    dispatch(roomActions.answerQuestionBegin({ questionId: pendingQuestion.id, answer }));
  };

  const handleAppeal = (reason: AppealReason) => {
    if (!pendingQuestion || isSubmitting) return;
    dispatch(roomActions.appealQuestionBegin({ questionId: pendingQuestion.id, reason }));
    setShowAppealReasons(false);
  };

  return (
    <div className={styles.panel}>
      <div className={cx(styles.turnBadge, { [styles.myTurn]: isMyTurn })}>
        {isMyTurn ? 'Сейчас ваш ход' : 'Ход соперника'}
      </div>

      {isRecipient && pendingQuestion ? (
        <div className={styles.pendingQuestion}>
          <strong>Вопрос соперника:</strong> {pendingQuestion.text}
          <div className={styles.answerButtons}>
            <Button onClick={() => handleAnswer(true)} disabled={isSubmitting}>
              Да
            </Button>
            <Button variant="secondary" onClick={() => handleAnswer(false)} disabled={isSubmitting}>
              Нет
            </Button>
            {!isAppealLocked && (
              <Button
                variant="secondary"
                onClick={() => setShowAppealReasons((value) => !value)}
                disabled={isSubmitting}
              >
                Аппеляция
              </Button>
            )}
          </div>
          {isAppealLocked && (
            <div className={styles.appealLockedNote}>
              Функция аппеляции отключена для вас из-за частых необоснованных аппеляций.
            </div>
          )}
          {showAppealReasons && !isAppealLocked && (
            <div className={styles.appealReasons}>
              <span className={styles.appealHint}>Причина аппеляции:</span>
              {APPEAL_REASONS.map((reason) => (
                <Button
                  key={reason}
                  variant="danger"
                  onClick={() => handleAppeal(reason)}
                  disabled={isSubmitting}
                >
                  {APPEAL_REASON_LABELS[reason]}
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form className={styles.askForm} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={canAsk ? 'Например: это мужчина?' : 'Дождитесь своего хода'}
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={!canAsk || isSubmitting}
            maxLength={200}
          />
          <Button type="submit" disabled={!canAsk || isSubmitting || !text.trim()}>
            Спросить
          </Button>
        </form>
      )}

      {actionError && <div className={styles.error}>{actionError}</div>}

      <div className={styles.guessRow}>
        <span className={styles.guessHint}>
          {guessMode ? 'Выберите карточку на поле, чтобы назвать её ответом' : 'Готовы назвать карточку соперника?'}
        </span>
        <Button
          variant={guessMode ? 'danger' : 'secondary'}
          onClick={() => dispatch(roomActions.guessModeToggled())}
          disabled={!canAsk && !guessMode}
        >
          {guessMode ? 'Отменить' : 'Финальная догадка'}
        </Button>
      </div>
    </div>
  );
};
