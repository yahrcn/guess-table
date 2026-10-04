import { getPool } from './pool.js';

// IDs are generated in application code (node:crypto randomUUID), not by a Postgres
// extension/function — keeps this schema portable across any managed Postgres without
// needing extension-create privileges.
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY,
  room_id TEXT NOT NULL,
  deck_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  winner_client_id TEXT
);

CREATE INDEX IF NOT EXISTS games_room_id_idx ON games (room_id);

CREATE TABLE IF NOT EXISTS game_players (
  game_id UUID NOT NULL REFERENCES games (id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  is_creator BOOLEAN NOT NULL DEFAULT false,
  is_winner BOOLEAN,
  PRIMARY KEY (game_id, client_id)
);

CREATE INDEX IF NOT EXISTS game_players_client_id_idx ON game_players (client_id);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games (id) ON DELETE CASCADE,
  author_client_id TEXT NOT NULL,
  text TEXT NOT NULL,
  normalized_text TEXT NOT NULL,
  answer BOOLEAN,
  asked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS questions_normalized_text_idx ON questions (normalized_text);
`;

export async function runMigrations(): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  try {
    await pool.query(SCHEMA_SQL);
    console.log('[db] schema ready');
  } catch (error) {
    console.error('[db] migration failed — analytics logging may not work until this is fixed', error);
  }
}
