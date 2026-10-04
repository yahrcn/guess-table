const SESSION_PREFIX = 'guess-table:room:';
const EXCLUDED_PREFIX = 'guess-table:excluded:';
const RULED_OUT_PREFIX = 'guess-table:ruledOut:';
const NAME_KEY = 'guess-table:playerName';
const CLIENT_ID_KEY = 'guess-table:clientId';

export interface StoredSession {
  playerId: string;
  playerToken: string;
  playerName: string;
}

export function loadSession(roomId: string): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_PREFIX + roomId);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(roomId: string, session: StoredSession): void {
  try {
    localStorage.setItem(SESSION_PREFIX + roomId, JSON.stringify(session));
  } catch {
    // localStorage unavailable (private mode, quota) — reconnect-by-token just won't work.
  }
}

export function clearRoomStorage(roomId: string): void {
  try {
    localStorage.removeItem(SESSION_PREFIX + roomId);
    localStorage.removeItem(EXCLUDED_PREFIX + roomId);
    localStorage.removeItem(RULED_OUT_PREFIX + roomId);
  } catch {
    // ignore
  }
}

export function loadPlayerName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

export function savePlayerName(playerName: string): void {
  try {
    localStorage.setItem(NAME_KEY, playerName);
  } catch {
    // ignore
  }
}

function createId(): string {
  return crypto.randomUUID();
}

/** Stable anonymous id for this browser, persisted forever — used only for play-stats aggregation, never shown to the opponent. */
export function loadOrCreateClientId(): string {
  try {
    const existing = localStorage.getItem(CLIENT_ID_KEY);
    if (existing) return existing;
    const created = createId();
    localStorage.setItem(CLIENT_ID_KEY, created);
    return created;
  } catch {
    return createId();
  }
}

export function loadExcludedCardIds(roomId: string): string[] {
  try {
    const raw = localStorage.getItem(EXCLUDED_PREFIX + roomId);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveExcludedCardIds(roomId: string, cardIds: string[]): void {
  try {
    localStorage.setItem(EXCLUDED_PREFIX + roomId, JSON.stringify(cardIds));
  } catch {
    // ignore quota errors
  }
}

export function loadRuledOutCardIds(roomId: string): string[] {
  try {
    const raw = localStorage.getItem(RULED_OUT_PREFIX + roomId);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveRuledOutCardIds(roomId: string, cardIds: string[]): void {
  try {
    localStorage.setItem(RULED_OUT_PREFIX + roomId, JSON.stringify(cardIds));
  } catch {
    // ignore quota errors
  }
}
