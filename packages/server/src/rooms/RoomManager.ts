import { randomBytes } from 'node:crypto';
import { Room } from './Room.js';

const CLEANUP_INTERVAL_MS = 15 * 60 * 1000;

function generateRoomId(): string {
  return randomBytes(4).toString('hex');
}

export class RoomManager {
  private rooms = new Map<string, Room>();

  constructor() {
    const timer = setInterval(() => this.cleanupExpired(), CLEANUP_INTERVAL_MS);
    timer.unref();
  }

  create(): Room {
    let id = generateRoomId();
    while (this.rooms.has(id)) {
      id = generateRoomId();
    }
    const room = new Room(id);
    this.rooms.set(id, room);
    return room;
  }

  get(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  remove(roomId: string): void {
    this.rooms.delete(roomId);
  }

  private cleanupExpired(): void {
    for (const [id, room] of this.rooms) {
      if (room.isExpired()) this.rooms.delete(id);
    }
  }
}
