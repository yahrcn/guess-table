import { getPool } from './pool.js';

/**
 * Every function here is fire-and-forget by design: analytics must never block or break
 * actual gameplay. If the pool isn't configured (DATABASE_URL unset) or a query fails,
 * we just log a warning and move on — call sites don't await these and don't check
 * a return value.
 */
async function run(sql: string, params: unknown[]): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  try {
    await pool.query(sql, params);
  } catch (error) {
    console.error('[gameLog] query failed', error);
  }
}

/**
 * Every write for a given gameDbId must land in the order Room.ts issued it — the very
 * first one always creates the `games` row, and every later write (game_players,
 * questions, appeals) has a foreign key on it. Firing them all independently raced: two
 * concurrent pool connections don't guarantee the one that started first commits first,
 * so a dependent insert could reach Postgres before the `games` row existed and trip the
 * FK constraint. Chaining per gameDbId fixes the ordering while staying fire-and-forget
 * from the caller's perspective. Each game's chain self-deletes once drained, so this
 * never grows unbounded.
 */
const pendingByGame = new Map<string, Promise<void>>();

function runForGame(gameDbId: string, sql: string, params: unknown[]): void {
  const previous = pendingByGame.get(gameDbId) ?? Promise.resolve();
  const next = previous.then(() => run(sql, params));
  pendingByGame.set(gameDbId, next);
  void next.then(() => {
    if (pendingByGame.get(gameDbId) === next) {
      pendingByGame.delete(gameDbId);
    }
  });
}

export function recordGameCreated(gameDbId: string, roomId: string, deckId: string): void {
  runForGame(gameDbId, 'INSERT INTO games (id, room_id, deck_id) VALUES ($1, $2, $3)', [gameDbId, roomId, deckId]);
}

export function recordGameDeckChanged(gameDbId: string, deckId: string): void {
  runForGame(gameDbId, 'UPDATE games SET deck_id = $2 WHERE id = $1', [gameDbId, deckId]);
}

export function recordPlayerJoined(gameDbId: string, clientId: string, playerName: string, isCreator: boolean): void {
  runForGame(
    gameDbId,
    `INSERT INTO game_players (game_id, client_id, player_name, is_creator)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (game_id, client_id) DO UPDATE SET player_name = EXCLUDED.player_name`,
    [gameDbId, clientId, playerName, isCreator]
  );
}

export function recordGameStarted(gameDbId: string): void {
  runForGame(gameDbId, 'UPDATE games SET started_at = now() WHERE id = $1 AND started_at IS NULL', [gameDbId]);
}

export function recordQuestionAsked(
  questionId: string,
  gameDbId: string,
  authorClientId: string,
  text: string,
  normalizedText: string
): void {
  runForGame(
    gameDbId,
    'INSERT INTO questions (id, game_id, author_client_id, text, normalized_text) VALUES ($1, $2, $3, $4, $5)',
    [questionId, gameDbId, authorClientId, text, normalizedText]
  );
}

export function recordQuestionAnswered(gameDbId: string, questionId: string, answer: boolean): void {
  runForGame(gameDbId, 'UPDATE questions SET answer = $2 WHERE id = $1', [questionId, answer]);
}

export function recordAppeal(
  appealId: string,
  gameDbId: string,
  questionId: string,
  appellantClientId: string,
  reason: string,
  upheld: boolean
): void {
  runForGame(
    gameDbId,
    'INSERT INTO appeals (id, game_id, question_id, appellant_client_id, reason, upheld) VALUES ($1, $2, $3, $4, $5, $6)',
    [appealId, gameDbId, questionId, appellantClientId, reason, upheld]
  );
}

export function recordGameFinished(gameDbId: string, winnerClientId: string): void {
  runForGame(gameDbId, 'UPDATE games SET finished_at = now(), winner_client_id = $2 WHERE id = $1 AND finished_at IS NULL', [
    gameDbId,
    winnerClientId,
  ]);
  runForGame(gameDbId, 'UPDATE game_players SET is_winner = (client_id = $2) WHERE game_id = $1', [gameDbId, winnerClientId]);
}
