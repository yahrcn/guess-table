import cx from 'classnames';
import { useState, type FormEvent } from 'react';
import type { QuestionEntry } from '@guess-table/shared';
import { useAppDispatch } from '../../../../config/hooks';
import { Button } from '../../../../shared/components/Button';
import { roomActions } from '../../slice';
import styles from './QuestionPanel.module.css';

interface Props {
  isMyTurn: boolean;
  pendingQuestion: QuestionEntry | null;
  isPendingQuestionMine: boolean;
  guessMode: boolean;
  isSubmitting: boolean;
  actionError: string | null;
}

export const QuestionPanel = ({
  isMyTurn,
  pendingQuestion,
  isPendingQuestionMine,
  guessMode,
  isSubmitting,
  actionError,
}: Props) => {
  const dispatch = useAppDispatch();
  // Uncommitted form input — not business state, doesn't need to live in redux.
  const [text, setText] = useState('');

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
          </div>
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
