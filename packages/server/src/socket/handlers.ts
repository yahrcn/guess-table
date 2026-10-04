import type { Server, Socket } from 'socket.io';
import { ERROR_CODES, type Ack, type ClientToServerEvents, type ServerToClientEvents } from '@guess-table/shared';
import type { Room } from '../rooms/Room.js';
import type { RoomManager } from '../rooms/RoomManager.js';

type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

interface ConnectionState {
  roomId?: string;
  playerId?: string;
}

function notInRoom(): Ack<never> {
  return { ok: false, error: { code: ERROR_CODES.ROOM_NOT_FOUND, message: 'Вы не подключены к комнате.' } };
}

export function registerSocketHandlers(io: AppServer, roomManager: RoomManager): void {
  io.on('connection', (socket: AppSocket) => {
    const state: ConnectionState = {};

    function currentRoom(): Room | undefined {
      return state.roomId ? roomManager.get(state.roomId) : undefined;
    }

    function broadcastRoom(room: Room): void {
      for (const playerId of room.allPlayerIds()) {
        const socketId = room.socketIdFor(playerId);
        if (socketId) {
          io.to(socketId).emit('room:state', room.snapshotFor(playerId));
        }
      }
    }

    socket.on('room:create', (payload, cb) => {
      const room = roomManager.create();
      const result = room.join(payload.playerName, socket.id);
      if (!result.ok) {
        cb(result);
        return;
      }
      state.roomId = room.id;
      state.playerId = result.data.playerId;
      socket.join(room.id);
      cb({ ok: true, data: { ...result.data, roomId: room.id } });
    });

    socket.on('room:join', (payload, cb) => {
      const room = roomManager.get(payload.roomId);
      if (!room) {
        cb({ ok: false, error: { code: ERROR_CODES.ROOM_NOT_FOUND, message: 'Комната не найдена. Проверьте ссылку.' } });
        return;
      }
      const result = room.join(payload.playerName, socket.id, payload.playerToken);
      if (!result.ok) {
        cb(result);
        return;
      }
      state.roomId = room.id;
      state.playerId = result.data.playerId;
      socket.join(room.id);
      cb({ ok: true, data: { ...result.data, roomId: room.id } });
      broadcastRoom(room);
    });

    socket.on('game:selectSecret', (payload, cb) => {
      const room = currentRoom();
      if (!room || !state.playerId) {
        cb(notInRoom());
        return;
      }
      const result = room.selectSecret(state.playerId, payload.cardId);
      cb(result);
      if (result.ok) broadcastRoom(room);
    });

    socket.on('game:askQuestion', (payload, cb) => {
      const room = currentRoom();
      if (!room || !state.playerId) {
        cb(notInRoom());
        return;
      }
      const result = room.askQuestion(state.playerId, payload.text);
      cb(result);
      if (result.ok) broadcastRoom(room);
    });

    socket.on('game:answerQuestion', (payload, cb) => {
      const room = currentRoom();
      if (!room || !state.playerId) {
        cb(notInRoom());
        return;
      }
      const result = room.answerQuestion(state.playerId, payload.questionId, payload.answer);
      cb(result);
      if (result.ok) broadcastRoom(room);
    });

    socket.on('game:finalGuess', (payload, cb) => {
      const room = currentRoom();
      if (!room || !state.playerId) {
        cb(notInRoom());
        return;
      }
      const result = room.finalGuess(state.playerId, payload.cardId);
      cb(result);
      if (result.ok) broadcastRoom(room);
    });

    socket.on('game:rematchBegin', (cb) => {
      const room = currentRoom();
      if (!room || !state.playerId) {
        cb(notInRoom());
        return;
      }
      const result = room.requestRematch(state.playerId);
      cb(result);
      if (result.ok) broadcastRoom(room);
    });

    socket.on('game:selectDeck', (payload, cb) => {
      const room = currentRoom();
      if (!room || !state.playerId) {
        cb(notInRoom());
        return;
      }
      const result = room.selectDeck(state.playerId, payload.deckId);
      cb(result);
      if (result.ok) broadcastRoom(room);
    });

    socket.on('disconnect', () => {
      const room = currentRoom();
      if (room) {
        room.markDisconnected(socket.id);
        broadcastRoom(room);
      }
    });
  });
}
