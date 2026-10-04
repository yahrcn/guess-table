import { Pool } from 'pg';

let pool: Pool | null = null;
let attempted = false;

/**
 * Returns `null` whenever DATABASE_URL isn't configured — every caller must treat that
 * as "analytics logging is disabled" and keep working, never as a reason to fail the
 * actual game. Game correctness must never depend on this database being up.
 */
export function getPool(): Pool | null {
  if (!attempted) {
    attempted = true;
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      pool = new Pool({
        connectionString,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
      });
      pool.on('error', (error) => {
        console.error('[db] pool error', error);
      });
    } else {
      console.warn('[db] DATABASE_URL is not set — game analytics logging and /admin are disabled.');
    }
  }
  return pool;
}
