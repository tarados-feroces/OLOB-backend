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
            const gameCreated = {
                data: {
                    state: {
                        opponent: { login: userService.getUser(nextPlayer).login, id: nextPlayer }
                    }
                },
                cls: gameMessageTypes.STARTED
            };

            const newGame = gameService.init(req.session.user.login, userService.clients[nextPlayer]);
            partyService.add(req.session.user.id, nextPlayer, newGame);
            userService.sendMessage(req.session.user.id, gameCreated);
            userService.sendMessage(nextPlayer, gameCreated);

            this.sendSnapshot(null, req);
        }
    };

    sendSnapshot = (data, req) => {
        const party = partyService.getCurrentParty(req);

        data.situation.type === GameStatus.MATE && this.gameEnded(data.currentUser === 'w' ? party.playerID2 : party.playerID1);

        this._sendData({
            data: {
                fen: data.fen,
                situation: {
                    type: data.situation
                },
                currentUser: data.currentUser === 'w' ? party.playerID1 : party.playerID2
            },
            cls: gameMessageTypes.SNAPSHOT }, req);
    };

    gameEnded = (winnerID, req) => {
        this._sendData({
            data: {
                state: {
                    winner: winnerID
                }
            },
            cls: gameMessageTypes.SNAPSHOT }, req);
    };

    makeStep = (data, req) => {
        const party = partyService.getCurrentParty(req);
        const game = party.game;

        const result = gameService.makeStep(game, data.step);

        partyService.updatePartyGame(req, result.game);

        this.sendSnapshot(result, req);
    };

    getAvailableMoves = (data, req) => {
        const party = partyService.getCurrentParty(req);
        const game = party.game;
        const steps = gameService.getAvailableMoves(game, data.pos);

        this._sendData({
            data: {
                steps: steps
            },
            cls: gameMessageTypes.UPDATE
        }, req);
    };

    _sendData = (message, req) => {
        const { playerID1, playerID2 } = partyService.getCurrentParty(req);
        userService.sendMessage(playerID1, message);
        userService.sendMessage(playerID2, message);
    };
}

const gameController = new GameController();
export default gameController;
