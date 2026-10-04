import { getPool } from '../db/pool.js';

export interface AdminStats {
  totals: {
    games: number;
    finishedGames: number;
    questions: number;
    players: number;
  };
  topPlayers: {
    clientId: string;
    playerName: string;
    gamesPlayed: number;
    wins: number;
  }[];
  topQuestions: {
    normalizedText: string;
    text: string;
    count: number;
  }[];
  decks: {
    deckId: string;
    count: number;
  }[];
  duration: {
    avgSeconds: number | null;
    medianSeconds: number | null;
    finishedCount: number;
  };
}

/** Returns null when DATABASE_URL isn't configured — caller renders a "no data" state instead of erroring. */
export async function getAdminStats(): Promise<AdminStats | null> {
  const pool = getPool();
  if (!pool) return null;

  const [totalsRes, topPlayersRes, topQuestionsRes, decksRes, durationRes] = await Promise.all([
    pool.query<{ games: string; finished_games: string; questions: string; players: string }>(`
      SELECT
        (SELECT COUNT(*) FROM games) AS games,
        (SELECT COUNT(*) FROM games WHERE finished_at IS NOT NULL) AS finished_games,
        (SELECT COUNT(*) FROM questions) AS questions,
        (SELECT COUNT(DISTINCT client_id) FROM game_players) AS players
    `),
    pool.query<{ client_id: string; player_name: string; games_played: string; wins: string }>(`
      SELECT
        gp.client_id,
        (array_agg(gp.player_name ORDER BY g.created_at DESC))[1] AS player_name,
        COUNT(*) AS games_played,
        COUNT(*) FILTER (WHERE gp.is_winner) AS wins
      FROM game_players gp
      JOIN games g ON g.id = gp.game_id
      GROUP BY gp.client_id
      ORDER BY games_played DESC
      LIMIT 10
    `),
    pool.query<{ normalized_text: string; text: string; count: string }>(`
      SELECT
        normalized_text,
        (array_agg(text ORDER BY asked_at DESC))[1] AS text,
        COUNT(*) AS count
      FROM questions
      GROUP BY normalized_text
      ORDER BY count DESC
      LIMIT 10
    `),
    pool.query<{ deck_id: string; count: string }>(`
      SELECT deck_id, COUNT(*) AS count
      FROM games
      GROUP BY deck_id
      ORDER BY count DESC
    `),
    pool.query<{ avg_seconds: string | null; median_seconds: string | null; finished_count: string }>(`
      SELECT
        AVG(EXTRACT(EPOCH FROM (finished_at - started_at))) AS avg_seconds,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (finished_at - started_at))) AS median_seconds,
        COUNT(*) AS finished_count
      FROM games
      WHERE finished_at IS NOT NULL AND started_at IS NOT NULL
    `),
  ]);

  const totals = totalsRes.rows[0];
  const duration = durationRes.rows[0];

  return {
    totals: {
      games: Number(totals?.games ?? 0),
      finishedGames: Number(totals?.finished_games ?? 0),
      questions: Number(totals?.questions ?? 0),
      players: Number(totals?.players ?? 0),
    },
    topPlayers: topPlayersRes.rows.map((row) => ({
      clientId: row.client_id,
      playerName: row.player_name,
      gamesPlayed: Number(row.games_played),
      wins: Number(row.wins),
    })),
    topQuestions: topQuestionsRes.rows.map((row) => ({
      normalizedText: row.normalized_text,
      text: row.text,
      count: Number(row.count),
    })),
    decks: decksRes.rows.map((row) => ({
      deckId: row.deck_id,
      count: Number(row.count),
    })),
    duration: {
      avgSeconds: duration?.avg_seconds != null ? Number(duration.avg_seconds) : null,
      medianSeconds: duration?.median_seconds != null ? Number(duration.median_seconds) : null,
      finishedCount: Number(duration?.finished_count ?? 0),
    },
  };
}
