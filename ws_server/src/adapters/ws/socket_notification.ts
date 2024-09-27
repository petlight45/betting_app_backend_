import {Server, Socket} from "socket.io";
import {SocketNotificationPort} from "../../core/ports/socket_notification";
import {LoggerPort} from "../../core/ports/logger";

type SocketIoNotificationAdapterParams = {
    io: Server
    logger: LoggerPort
}

export class SocketIoNotificationAdapter implements SocketNotificationPort {
    private io: Server;
    private logger: LoggerPort

    constructor(params: SocketIoNotificationAdapterParams) {
        this.io = params.io;
        this.logger = params.logger;
    }

    notifyRoom(roomId: string, message: any): void {
        this.logger.info(`Message delivered to room ${roomId} : Message ${JSON.stringify(message)}`)
        this.io.to(roomId).emit('notification', message);
    }

    handleClientJoinRoom(socket: Socket, roomId: string) {
        this.logger.info(`Socket client ${socket.id} added to room ${roomId}`)
        socket.join(roomId);
    }
}
