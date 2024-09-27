import {faker} from '@faker-js/faker';
import User from "../../core/entities/user";
import Game from "../../core/entities/game";
import GameEvent, {GameEventTeamEnum, GameEventTypeEnum} from "../../core/entities/game_event";
import LeaderboardItem from "../../core/entities/leaderboard";

export default class MockHelperUtils {
    static generateMockUser(): User {
        const id_ = faker.database.mongodbObjectId()
        return {
            id: id_,
            _id: id_,
            username: faker.internet.userName(),
            email: faker.internet.email()
        };
    }

    static generateMockGame(isOngoing?: boolean): Game {
        const id_ = faker.database.mongodbObjectId()
        const data = {
            _id: id_,
            homeTeam: faker.lorem.words(1),
            awayTeam: faker.lorem.words(1),
            defaultOddsHomeWin: faker.number.float({min: 0.5, max: 2.5, fractionDigits: 1}),
            defaultOddsAwayWin: faker.number.float({min: 0.5, max: 2.5, fractionDigits: 1}),
            defaultOddsDraw: faker.number.float({min: 0.5, max: 2.5, fractionDigits: 1}),
            startedAt: faker.date.future().toString(),
            isOngoing: faker.datatype.boolean()
        }
        // @ts-ignore
        return data;
    }

    static generateMockGameEvent(gameId?: string): GameEvent {
        const id_ = faker.database.mongodbObjectId()
        gameId = gameId || faker.database.mongodbObjectId()
        const data = {
            _id: id_,
            gameId,
            type: faker.helpers.arrayElement(Object.values(GameEventTypeEnum)),
            team: faker.helpers.arrayElement(Object.values(GameEventTeamEnum)),
            player: faker.person.firstName()
        }
        // @ts-ignore
        return data;
    }


    static generateLeaderboardItem(userId?: string): LeaderboardItem {
        userId = userId || faker.database.mongodbObjectId()
        const data = {
            userId,
            userName: faker.internet.userName(),
            totalWins: faker.number.int({min: 0, max: 10}),
            totalLosses: faker.number.int({min: 0, max: 10}),
            totalProfits: faker.number.int({min: 0, max: 10}),
        }
        // @ts-ignore
        return data;
    }
}