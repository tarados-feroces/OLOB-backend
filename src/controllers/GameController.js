'use strict';
import partyService from '../services/PartyService';
import { gameMessageTypes } from '../constants/GameConstants';
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
            this.gameQueue.push(req.session.user.login);
        } else {
            const gameCreated = {
                data: {
                    enemy: { ...userService.getUser(nextPlayer), _id: nextPlayer }
                },
                cls: gameMessageTypes.STARTED
            };

            const newGame = gameService.init(req.session.user.login, userService.clients[nextPlayer]);
            partyService.add(req.session.user.id, nextPlayer, newGame);
            userService.sendMessage(req.session.user.id, gameCreated);
            userService.sendMessage(nextPlayer, gameCreated);

            this.sendSnapshot();
        }
    };

    sendSnapshot = (data, req) => {
        const game = partyService.getCurrentParty(req).game;
        this._sendData({
            data: {
                state: game
            },
            cls: gameMessageTypes.SNAPSHOT }, req);
    };

    makeStep = (data, req) => {
        const party = partyService.getCurrentParty(req);
        const game = party.game;

        const result = gameService.makeStep(game, data.step);

        partyService.updatePartyGame(req, result.game);

        this._sendData({
            data: {
                ...data,
                status: result.status
            },
            cls: gameMessageTypes.UPDATE
        }, req);
    };

    getAvailableMoves = (data, req) => {
        const party = partyService.getCurrentParty(req);
        const game = party.game;
        const steps = gameService.getAvailableMoves(game, data.pos);

        this._sendData({
            data: {
                steps: steps
            },
            cls: gameMessageTypes.AREAS
        }, req);
    };

    _sendData = (message, req) => {
        const players = partyService.parties[partyService.getCurrentParty(req)];
        userService.sendMessage(players.playerID1, message);
        userService.sendMessage(players.playerID2, message);
    };
}

const gameController = new GameController();
export default gameController;
