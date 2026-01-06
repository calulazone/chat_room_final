import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as fs from 'fs';
import path from 'path';

@WebSocketGateway({
  cors: {
    origin: 'localhost:3000',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>();
  private userRooms = new Map<string, string>();
  private logFile = path.join(process.cwd(), 'src', 'chat.log');

  private writeLog(message: string, type = 'SYSTEM') {
    const time = new Date().toISOString();
    const logLine = `[${time}] ${type}: ${message}\n`;
    fs.appendFile(this.logFile, logLine, (err) => {
      if (err) console.error('Erreur écriture log:', err);
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.writeLog(
      `Le client ${client.id} s'est connecté à l'application`,
      'SYSTEM',
    );
  }

  handleDisconnect(client: Socket) {
    const username = this.users.get(client.id);
    const room = this.userRooms.get(client.id);

    if (room && username) {
      client.to(room).emit('systemMessage', `${username} a quitté la room`);
      this.writeLog(`${username} a quitté la room ${room}`, 'EXIT');
    }

    this.users.delete(client.id);
    this.userRooms.delete(client.id);
    this.writeLog(
      `Le client ${client.id} s'est déconnecté de l'application`,
      'SYSTEM',
    );
  }

  @SubscribeMessage('setUsername')
  setUsername(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    this.users.set(client.id, username);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    const previousRoom = this.userRooms.get(client.id);
    const username = this.users.get(client.id);

    // Quitte l'ancienne room
    if (previousRoom) {
      client.leave(previousRoom);
      client
        .to(previousRoom)
        .emit('systemMessage', `${username} a quitté la room`);
      this.writeLog(`${username} a quitté la room ${room}`, 'EXIT');
    }

    client.join(room);
    this.userRooms.set(client.id, room);

    client.emit('systemMessage', `Tu as rejoint la room`);
    client.to(room).emit('systemMessage', `${username} a rejoint la room`);
    this.writeLog(`${username} a rejoint la room ${room}`, 'JOIN');
  }

  @SubscribeMessage('chatMessage')
  sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    const username = this.users.get(client.id);
    const room = this.userRooms.get(client.id);

    if (!username || !room) return;

    this.server.to(room).emit('chatMessage', {
      username,
      message,
    });
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket) {
    const username = this.users.get(client.id);
    const room = this.userRooms.get(client.id);

    if (!username || !room) return;

    client.to(room).emit('userTyping', username);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(@ConnectedSocket() client: Socket) {
    const username = this.users.get(client.id);
    const room = this.userRooms.get(client.id);

    if (!username || !room) return;

    client.to(room).emit('userStopTyping', username);
  }
}
