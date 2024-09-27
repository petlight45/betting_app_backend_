import container from "../../infrastructure/container";
import server, {logger, serverPort, startApp} from "../../app";
import {asFunction} from "awilix";
import {AuthServicePort, AuthUserDetails} from "../../core/ports/auth";
import {MockAuthService} from "../mocks/AuthService";
import MockHelperUtils from "../mocks";
import User from "../../core/entities/user";
import Client from 'socket.io-client';
import {WebsocketPayloadDataType} from "../../core/usecases/data_types";
import {startWorker} from "../../worker";

describe('App Integration Tests', () => {
    let authUser: User
    let messageQueueName: string;
    let authService: AuthServicePort;
    let appServerURL: string;

    beforeAll(async () => {
        container.register('authServicePort', asFunction(() => MockAuthService))
        await startApp();
        authUser = MockHelperUtils.generateMockUser()
        MockAuthService.authenticate.mockResolvedValue(authUser as AuthUserDetails)
        const appConfig = container.resolve('appConfig');
        authService = container.resolve('appConfig');
        appServerURL = `ws://127.0.0.1:${appConfig.SERVER_PORT}`
        messageQueueName = appConfig.MESSAGE_QUEUE_NAME
        server.listen(serverPort, () => {
            const cache = container.resolve('cache')
            const appConfig = container.resolve('appConfig')
            const notifyEvents = container.resolve("notifyEvents")
            logger.info(`Server listening on port ${serverPort}`)
            startWorker(cache, appConfig, logger, notifyEvents)
        })
    });

    afterEach(() => {
        // Ensure all timeouts and intervals are cleared
        jest.clearAllTimers();
    });


    it('should connect to the websocket', (done) => {
        const socket = Client(appServerURL);
        socket.on('connect', () => {
            done()
        });
    }, 5000);


    it('should receive event from the backend - leaderboard item', (done) => {
        const socket = Client(appServerURL);
        socket.on('connect', () => {
            const notifyEvents = container.resolve('notifyEvents');
            // Subscribe to leaderboard events
            socket.emitWithAck('leaderboard-event-subscribe', {} as any).then((ack) => {
                const leaderboardItem = MockHelperUtils.generateLeaderboardItem()
                notifyEvents.notifyLeaderBoardItem(leaderboardItem)
                socket.on("notification", (e) => {
                    if (e.type === WebsocketPayloadDataType.LEADERBOARD) {
                        done()
                    }
                })
            });
        });

    }, 5000);

    it('should receive event from the backend - game item', (done) => {
        const socket = Client(appServerURL);
        socket.on('connect', () => {
            const notifyEvents = container.resolve('notifyEvents');
            const gameItem = MockHelperUtils.generateMockGame()
            // Subscribe to game item events
            socket.emitWithAck('game-subscribe', {gameId: gameItem._id} as any).then((ack) => {
                notifyEvents.notifyGameItem(gameItem)
                socket.on("notification", (e) => {
                    if (e.type === WebsocketPayloadDataType.GAME) {
                        done()
                    }
                })
            });
        });

    }, 5000);

    it('should receive event from the backend - game event item', (done) => {
        const socket = Client(appServerURL);
        socket.on('connect', () => {
            const notifyEvents = container.resolve('notifyEvents');
            const gameEventItem = MockHelperUtils.generateMockGameEvent()
            // Subscribe to game event item events
            socket.emitWithAck('game-event-subscribe', {gameId: gameEventItem.gameId} as any).then((ack) => {
                notifyEvents.notifyGameEventItem(gameEventItem)
                socket.on("notification", (e) => {
                    if (e.type === WebsocketPayloadDataType.GAME_EVENT) {
                        done()
                    }
                })
            });
        });

    }, 5000);

});