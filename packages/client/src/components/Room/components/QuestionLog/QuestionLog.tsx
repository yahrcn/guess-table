import cx from 'classnames';
import { useMemo } from 'react';
import type { PlayerView, QuestionEntry } from '@guess-table/shared';
import styles from './QuestionLog.module.css';

interface Props {
  questions: QuestionEntry[];
  players: PlayerView[];
}

export const QuestionLog = ({ questions, players }: Props) => {
  const nameById = useMemo(() => new Map(players.map((player) => [player.id, player.name])), [players]);
  const latestFirst = useMemo(() => [...questions].reverse(), [questions]);

  if (questions.length === 0) {
    return (
      <div className={styles.log}>
        <div className={styles.empty}>Вопросов пока не было.</div>
      </div>
    );
  }

  return (
    <div className={styles.log}>
      {latestFirst.map((question) => (
        <div key={question.id} className={styles.entry}>
          <span>
            <span className={styles.author}>{nameById.get(question.authorId) ?? 'Игрок'}:</span> {question.text}
          </span>
          {question.answer === null ? (
            <span className={styles.waiting}>ожидание…</span>
          ) : (
            <span className={cx(styles.answer, question.answer ? styles.yes : styles.no)}>
              {question.answer ? 'Да' : 'Нет'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
