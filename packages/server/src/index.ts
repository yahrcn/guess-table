import 'dotenv/config';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '@guess-table/shared';
import { adminAuth } from './admin/adminAuth.js';
import { getAdminPageHtml } from './admin/adminPage.js';
import { getAdminStats } from './admin/statsRepository.js';
import { runMigrations } from './db/migrate.js';
import { RoomManager } from './rooms/RoomManager.js';
import { registerSocketHandlers } from './socket/handlers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 4000;
const isProduction = process.env.NODE_ENV === 'production';

// Postgres is reachable over the network and can fail in ways a single try/catch at
// the call site might miss — don't let a DB hiccup take the whole game server down.
process.on('unhandledRejection', (error) => {
  console.error('[server] unhandled rejection', error);
});

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: isProduction ? undefined : { origin: 'http://localhost:5173' },
});

const roomManager = new RoomManager();
registerSocketHandlers(io, roomManager);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/admin', adminAuth, (_req, res) => {
  res.type('html').send(getAdminPageHtml());
});

app.get('/api/admin/stats', adminAuth, async (_req, res) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error('[admin] failed to load stats', error);
    res.status(500).json({ error: 'Не удалось получить статистику — проверьте подключение к базе данных.' });
  }
});

// Keyed on the build actually being present on disk rather than NODE_ENV — some hosts
// don't propagate configured env vars to the running process the way you'd expect, and
// this is the one thing that must not silently no-op when that happens.
const clientIndexHtml = path.resolve(__dirname, '../../client/dist/index.html');
const hasClientBuild = existsSync(clientIndexHtml);
if (hasClientBuild) {
  app.use(express.static(path.dirname(clientIndexHtml)));
  app.get('*', (_req, res) => {
    res.sendFile(clientIndexHtml);
  });
}

async function start() {
  await runMigrations();
  httpServer.listen(PORT, () => {
    console.log(`Guess-table server listening on port ${PORT} (${isProduction ? 'production' : 'development'})`);
    console.log(hasClientBuild ? `Serving client build from ${path.dirname(clientIndexHtml)}` : 'Client build not found — serving API/WebSocket only.');
  });
}

start();
