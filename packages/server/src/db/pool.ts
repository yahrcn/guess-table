import { Pool, type PoolConfig } from 'pg';

let pool: Pool | null = null;
let attempted = false;

/**
 * Timeweb Cloud's managed Postgres hands you separate host/port/user/password/dbname
 * variables instead of one connection string — support both so nobody has to hand-build
 * a URL (and hit the usual bug where a password with special characters needs escaping).
 */
function readPoolConfig(): PoolConfig | null {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    return { connectionString };
  }

  const host = process.env.POSTGRESQL_HOST;
  const user = process.env.POSTGRESQL_USER;
  const database = process.env.POSTGRESQL_DBNAME;
  if (host && user && database) {
    return {
      host,
      port: process.env.POSTGRESQL_PORT ? Number(process.env.POSTGRESQL_PORT) : undefined,
      user,
      password: process.env.POSTGRESQL_PASSWORD,
      database,
    };
  }

  return null;
}

/**
 * Returns `null` whenever no connection details are configured — every caller must treat
 * that as "analytics logging is disabled" and keep working, never as a reason to fail the
 * actual game. Game correctness must never depend on this database being up.
 */
export function getPool(): Pool | null {
  if (!attempted) {
    attempted = true;
    const config = readPoolConfig();
    if (config) {
      pool = new Pool({
        ...config,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
      });
      pool.on('error', (error) => {
        console.error('[db] pool error', error);
      });
    } else {
      console.warn(
        '[db] no DATABASE_URL or POSTGRESQL_HOST/PORT/USER/PASSWORD/DBNAME set — game analytics logging and /admin are disabled.'
      );
    }
  }
  return pool;
}
