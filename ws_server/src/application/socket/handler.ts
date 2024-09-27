import {Socket} from "socket.io";
import {AuthServicePort} from "../../core/ports/auth";
import {SocketNotificationPort} from "../../core/ports/socket_notification";
import {LoggerPort} from "../../core/ports/logger";
import {notificationRoom} from "../../core/usecases/notify_events";


export const clientSocketEventHandler = (
    socket: Socket,
    notificationPort: SocketNotificationPort,
    authService: AuthServicePort,
    logger: LoggerPort
) => {
    // Handle emit log
    socket.onAny((event, ...args) => {
        logger.info(`Event '${event}' emitted from ${socket.id} with args: ${JSON.stringify(args)}`);
    });

    // Handle disconnection log
    socket.on('disconnect', () => {
        logger.info(`Client ${socket.id} disconnected`);
    });
    const token = socket.handshake.auth.token || socket.handshake.headers?.auth;
    // Authenticate the user using the token
    authService.authenticate(token).then((userDetails) => {
        if (userDetails) {
            // Store user details in socket session
            (socket as any).user = userDetails;

            socket.on('leaderboard-event-subscribe', (data, callback) => {
                logger.info(`Received user message from ${socket.id}: ${JSON.stringify(data)} leaderboard-event-subscribe`);
                notificationPort.handleClientJoinRoom(socket, notificationRoom.leaderboardUpdate())
                if (callback) {
                    callback({status: 'ok', message: 'Leaderboard event subscription successful'});
                }
            });

            socket.on('game-event-subscribe', (data, callback) => {
                logger.info(`Received user message from ${socket.id}: ${JSON.stringify(data)} game-event-subscribe`);
                const {gameId} = data;
                notificationPort.handleClientJoinRoom(socket, notificationRoom.gameEventUpdate(gameId))
                if (callback) {
                    callback({status: 'ok', message: `Game ${gameId} event subscription successful`});
                }
            });

            socket.on('game-subscribe', (data, callback) => {
                logger.info(`Received user message from ${socket.id}: ${JSON.stringify(data)} game-subscribe`);
                const {gameId} = data;
                notificationPort.handleClientJoinRoom(socket, notificationRoom.gameUpdate(gameId))
                if (callback) {
                    callback({status: 'ok', message: `Game ${gameId} subscription successful`});
                }
            });
        } else {
            logger.error("Authentication Failed")
            socket.emit("auth_error", {message: 'Authentication failed'});
            socket.disconnect();
        }
    }).catch((err) => {
        logger.error(err as string | Error)
        socket.emit("auth_error", {message: 'Authentication failed'});
        socket.disconnect();
    });
};
