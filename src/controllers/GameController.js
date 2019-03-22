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
            const newGame = gameService.init(req.session.user.id, userService.clients[nextPlayer]);
            partyService.add(req.session.user.id, nextPlayer, newGame);

            const gameCreated = {
                data: {
                    opponent: { login: userService.getUser(nextPlayer).login, id: nextPlayer },
                    fen: newGame,
                    situation: {},
                    currentUser: req.session.user.id
                },
                cls: gameMessageTypes.STARTED
            };

            userService.sendMessage(req.session.user.id, gameCreated);
            userService.sendMessage(nextPlayer, gameCreated);
        }
    };

    sendSnapshot = (data, req) => {
        const party = partyService.getCurrentParty(req);

        data.situation &&
            data.situation.type === GameStatus.MATE &&
            this.gameEnded(data.currentUser === 'w' ? party.playerID2 : party.playerID1);

        this._sendData({
            data: {
                fen: data.fen,
                situation: {
                    type: data.situation ? data.situation : ''
                },
                currentUser: data.currentUser && data.currentUser === 'b' ? party.playerID2 : party.playerID1
            },
            cls: gameMessageTypes.SNAPSHOT }, req);
    };

    gameEnded = (winnerID, req) => {
        this._sendData({
            data: {
                winner: winnerID
            },
            cls: gameMessageTypes.SNAPSHOT }, req);
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
