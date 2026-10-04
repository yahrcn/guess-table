import cx from 'classnames';
import { useMemo } from 'react';
import { getDeckCards, type DeckId, type FinalGuessEntry, type PlayerView, type QuestionEntry } from '@guess-table/shared';
import styles from './QuestionLog.module.css';

interface Props {
  deckId: DeckId;
  questions: QuestionEntry[];
  finalGuesses: FinalGuessEntry[];
  players: PlayerView[];
}

type LogItem =
  | { kind: 'question'; createdAt: number; question: QuestionEntry }
  | { kind: 'guess'; createdAt: number; guess: FinalGuessEntry };

export const QuestionLog = ({ deckId, questions, finalGuesses, players }: Props) => {
  const nameById = useMemo(() => new Map(players.map((player) => [player.id, player.name])), [players]);
  const cardNameById = useMemo(
    () => new Map(getDeckCards(deckId).map((card) => [card.id, card.displayName])),
    [deckId]
  );

  const latestFirst = useMemo(() => {
    const items: LogItem[] = [
      ...questions.map((question): LogItem => ({ kind: 'question', createdAt: question.createdAt, question })),
      ...finalGuesses.map((guess): LogItem => ({ kind: 'guess', createdAt: guess.createdAt, guess })),
    ];
    return items.sort((a, b) => b.createdAt - a.createdAt);
  }, [questions, finalGuesses]);

  if (latestFirst.length === 0) {
    return (
      <div className={styles.log}>
        <div className={styles.empty}>Вопросов пока не было.</div>
      </div>
    );
  }

  return (
    <div className={styles.log}>
      {latestFirst.map((item) =>
        item.kind === 'question' ? (
          <div key={item.question.id} className={styles.entry}>
            <span>
              <span className={styles.author}>{nameById.get(item.question.authorId) ?? 'Игрок'}:</span>{' '}
              {item.question.text}
            </span>
            {item.question.answer === null ? (
              <span className={styles.waiting}>ожидание…</span>
            ) : (
              <span className={cx(styles.answer, item.question.answer ? styles.yes : styles.no)}>
                {item.question.answer ? 'Да' : 'Нет'}
              </span>
            )}
          </div>
        ) : (
          <div key={item.guess.id} className={styles.entry}>
            <span>
              <span className={styles.author}>{nameById.get(item.guess.authorId) ?? 'Игрок'}:</span> финальная
              догадка — {cardNameById.get(item.guess.cardId) ?? 'карточка'}
            </span>
            <span className={cx(styles.answer, item.guess.correct ? styles.yes : styles.no)}>
              {item.guess.correct ? 'Верно' : 'Неверно'}
            </span>
          </div>
        )
      )}
    </div>
  );
};
