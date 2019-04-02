'use strict';
import partyService from '../services/PartyService';
import { gameMessageTypes, GameStatus } from '../constants/GameConstants';
import userService from '../services/UserService';
import gameService from '../services/GameService';

class GameController {
    constructor() {
        this.gameQueue = [];

        this.messageHandlers = {
            [gameMessageTypes.SEARCH]: this.searchGame,
            [gameMessageTypes.STEP]: this.makeStep,
            [gameMessageTypes.AREAS]: this.getAvailableMoves,
            [gameMessageTypes.SNAPSHOT]: this.sendSnapshot
        };
    }

    searchGame = (message, req) => {
        const nextPlayer = this.gameQueue.shift();
        if (!nextPlayer) {
            this.gameQueue.push(req.session.user.id);
        } else {
            this.startGame(req.session.user.id, nextPlayer);
        }
    };

    async startGame(userID1, userID2) {
        const newGame = gameService.init(userID1, userID2);
        partyService.add(userID1, userID2, newGame);

        const whiteUserOpponent = await userService.getUser(userID2);
        const blackUserOpponent = await userService.getUser(userID1);

        const gameCreatedWhite = {
            data: {
                opponent: whiteUserOpponent[1],
                fen: newGame,
                situation: {},
                currentUser: userID1,
                side: 0
            },
            cls: gameMessageTypes.STARTED
        };

        const gameCreatedBlack = {
            data: {
                opponent: blackUserOpponent[1],
                fen: newGame,
                situation: {},
                currentUser: userID1,
                side: 1
            },
            cls: gameMessageTypes.STARTED
        };

        userService.sendMessage(userID1, gameCreatedWhite);
        userService.sendMessage(userID2, gameCreatedBlack);
    }

    sendSnapshot = (data, req) => {
        const party = partyService.getCurrentParty(req);

        data.situation &&
            data.situation.type === GameStatus.MATE &&
            this.gameEnded(data.currentUser === 'w' ? party.playerID2 : party.playerID1, req);

        const currentUser = data.currentUser && data.currentUser === 'b' ? party.playerID2 : party.playerID1;
        console.log('CURRENT: ', currentUser);

        this._sendData({
            data: {
                fen: data.fen,
                situation: {
                    type: data.situation ? data.situation : ''
                },
                currentUser
            },
            cls: gameMessageTypes.SNAPSHOT }, req);
    };

    gameEnded = (winnerID, req) => {
        partyService.delete(partyService.getCurrentPartyID(req));
        this._sendData({
            data: {
                winner: winnerID
            },
            cls: gameMessageTypes.FINISHED }, req);
    };

    makeStep = (data, req) => {
        const party = partyService.getCurrentParty(req);
        const game = party.game;

        const result = gameService.makeStep(game, data.step);

        partyService.updatePartyGame(req, result.fen);

        this.sendSnapshot(result, req);
    };

    getAvailableMoves = (data, req) => {
        const party = partyService.getCurrentParty(req);
        const game = party.game;
        const steps = gameService.getAvailableMoves(game, data.position);

        console.log('STEPS: ', steps);

        userService.sendMessage(req.session.user.id, {
            data: {
                steps: steps
            },
            cls: gameMessageTypes.UPDATE
        });
    };

    _sendData = (message, req) => {
        const { playerID1, playerID2 } = partyService.getCurrentParty(req);
        userService.sendMessage(playerID1, message);
        userService.sendMessage(playerID2, message);
    };
}

const gameController = new GameController();
export default gameController;
