import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { Button } from '../../shared/components/Button';
import { AsyncStatus } from '../../shared/types';
import { selectHomeViewModel } from './selectors/viewSelectors';
import { homeActions } from './slice';
import styles from './Home.module.css';

export const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { playerName: storedName, createStatus, createError, createdRoomId } = useAppSelector(selectHomeViewModel);

  // Uncommitted form input — not business state, doesn't need to live in redux.
  const [name, setName] = useState(storedName);
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    if (createStatus === AsyncStatus.Succeeded && createdRoomId) {
      navigate(`/room/${createdRoomId}`);
    }
  }, [createStatus, createdRoomId, navigate]);

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || createStatus === AsyncStatus.Pending) return;
    dispatch(homeActions.createRoomBegin({ playerName: trimmedName }));
  };

  const handleJoin = (event: FormEvent) => {
    event.preventDefault();
    const trimmedCode = joinCode.trim();
    if (!trimmedCode) return;
    const match = trimmedCode.match(/room\/([a-zA-Z0-9]+)/);
    const roomId = match ? match[1] : trimmedCode;
    navigate(`/room/${roomId}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div>
          <h1 className={styles.title}>Угадай персонажа</h1>
          <p className={styles.subtitle}>
            Загадайте карточку, задавайте да/нет-вопросы и вычисляйте персонажа соперника.
          </p>
        </div>

        <form className={styles.field} onSubmit={handleCreate}>
          <label htmlFor="player-name">Ваше имя</label>
          <input
            id="player-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Например, Аня"
            maxLength={30}
          />
          <Button type="submit" disabled={!name.trim() || createStatus === AsyncStatus.Pending}>
            {createStatus === AsyncStatus.Pending ? 'Создаём комнату…' : 'Создать игру'}
          </Button>
          {createError && <span className={styles.error}>{createError}</span>}
        </form>

        <div className={styles.divider}>или</div>

        <form className={styles.joinRow} onSubmit={handleJoin}>
          <input
            placeholder="Вставьте ссылку или код комнаты"
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value)}
          />
          <Button type="submit" variant="secondary" disabled={!joinCode.trim()}>
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
};
