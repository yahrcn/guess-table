import cx from 'classnames';
import { useState } from 'react';
import type { PlayerView } from '@guess-table/shared';
import { Button } from '../../../../shared/components/Button';
import styles from './PlayersHeader.module.css';

interface Props {
  players: PlayerView[];
  myPlayerId: string | null;
  currentTurnPlayerId: string | null;
  showTurn: boolean;
}

export const PlayersHeader = ({ players, myPlayerId, currentTurnPlayerId, showTurn }: Props) => {
  // Purely ephemeral UI feedback (hide after 2s) — not business state, so a local flag is fine here.
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — user can still copy the URL manually.
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.players}>
        {players.map((player) => (
          <div key={player.id} className={cx(styles.player, { [styles.turn]: showTurn && player.id === currentTurnPlayerId })}>
            <span className={cx(styles.dot, { [styles.online]: player.connected })} />
            {player.name}
            {player.id === myPlayerId && <span className={styles.you}>(вы)</span>}
          </div>
        ))}
      </div>
      <div className={styles.linkRow}>
        {copied && <span className={styles.copied}>Ссылка скопирована</span>}
        <Button variant="secondary" onClick={handleCopyLink}>
          Скопировать ссылку
        </Button>
      </div>
    </div>
  );
};
