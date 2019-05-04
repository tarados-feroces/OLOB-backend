'use strict';
import partyService from '../services/PartyService';
import { gameMessageTypes, GameStatus } from '../constants/GameConstants';
import userService from '../services/UserService';
import gameService from '../services/GameService';

class GameController {
    constructor() {
        this.gameQueue = [];

        this.messageHandlers = {
            [ gameMessageTypes.SEARCH ]: this.searchGame.bind(this),
            [ gameMessageTypes.STEP ]: this.makeStep,
            [ gameMessageTypes.AREAS ]: this.getAvailableMoves,
            [ gameMessageTypes.SNAPSHOT ]: this.sendSnapshot,
            [ gameMessageTypes.DISCONNECT ]: this.leaveGame,
            [ gameMessageTypes.CHAT_MESSAGE ]: this.chatMessage,
        };
    }

    async searchGame (message, req) {
        const nextPlayer = this.gameQueue.shift();
        if (!nextPlayer) {
            this.gameQueue.push(req.session.user.id);
        } else {
            await this.startGame(req.session.user.id, nextPlayer);
        }
    };

    async onDeleteWSSession (clientID) {
        console.log('deleting game');
        const partyID = partyService.getUserPartyID(clientID);
        if (partyID) {
            await this.sendOpponentDisconnect(clientID);
            await partyService.delete(partyID);
        }
    };

    leaveGame = (data, req) => {
        const { playerID1, playerID2 } = partyService.getCurrentParty(req);
        const winnerID = playerID1 === req.session.user.id ? playerID2 : playerID1;
        this.saveGameData(playerID1, playerID2, winnerID);

        userService.sendMessage(winnerID, { data: {
            winner: winnerID
            }, cls: gameMessageTypes.FINISHED });

        partyService.delete(partyService.getCurrentPartyID(req));
        // userService.removeClient(req.session.user.id);
    };

    async startGame(userID1, userID2) {
        const newGame = gameService.init(userID1, userID2);
        partyService.add(userID1, userID2, newGame);

        const whiteUserOpponent = await userService.getUser(userID2);
        const blackUserOpponent = await userService.getUser(userID1);

        const gameCreatedWhite = {
            data: {
                opponent: whiteUserOpponent[1],
                fen: newGame.fen(),
                situation: {},
                currentUser: userID1,
                side: 0
            },
            cls: gameMessageTypes.STARTED
        };

        const gameCreatedBlack = {
            data: {
                opponent: blackUserOpponent[1],
                fen: newGame.fen(),
                situation: {},
                currentUser: userID1,
                side: 1
            },
            cls: gameMessageTypes.STARTED
        };

        await userService.sendMessage(userID1, gameCreatedWhite);
        await userService.sendMessage(userID2, gameCreatedBlack);
    }

    async sendSnapshot (data, req) {
        const party = partyService.getCurrentParty(req);

        data.situation &&
            data.situation.type === GameStatus.MATE &&
            this.gameEnded(data.currentUser === 'w' ? party.playerID2 : party.playerID1, req);

        const currentUser = data.currentUser && data.currentUser === 'b' ? party.playerID2 : party.playerID1;
        console.log('CURRENT: ', currentUser);

        await this._sendData({
            data: {
                fen: data.chess.fen(),
                situation: {
                    type: data.situation ? data.situation : ''
                },
                currentUser
            },
            cls: gameMessageTypes.SNAPSHOT }, req);
    };

    async gameEnded (winnerID, req) {
        const { playerID1, playerID2 } = partyService.getCurrentParty(req);
        await this.saveGameData(playerID1, playerID2, winnerID);
        await this._sendData({
            data: {
                winner: winnerID
            },
            cls: gameMessageTypes.FINISHED }, req);
        await partyService.delete(partyService.getCurrentPartyID(req));
    };

    makeStep = (data, req) => {
        const party = partyService.getCurrentParty(req);
        const game = party.game;

        const result = gameService.makeStep(game, data.step);

        partyService.updatePartyGame(req, result.chess);

        this.sendSnapshot(result, req);
    };

    async getAvailableMoves (data, req) {
        const party = partyService.getCurrentParty(req);
        const game = party.game;
        const steps = gameService.getAvailableMoves(game, data.position);

        await userService.sendMessage(req.session.user.id, {
            data: {
                steps: steps
            },
            cls: gameMessageTypes.UPDATE
        });
    };

    async chatMessage (data, req) {
        await this._sendData({
            cls: gameMessageTypes.CHAT_MESSAGE,
            data: {
                message: data
            }
        }, req)
    };

    async _sendData (message, req) {
        const { playerID1, playerID2 } = partyService.getCurrentParty(req);
        await userService.sendMessage(playerID1, message);
        await userService.sendMessage(playerID2, message);
    };

    async saveGameData (playerID1, playerID2, winner) {
        await userService.addUserGame(playerID1, {
            opponent: playerID2,
            winner
        });
        await userService.addUserGame(playerID2, {
            opponent: playerID1,
            winner
        });
    };

    async sendOpponentDisconnect (disconnectedID) {
        const winnerID = partyService.getEnemyOfUser(disconnectedID);
        if (!winnerID || winnerID === disconnectedID) {
            return;
        }
        await userService.sendMessage(winnerID, { data: {
                winner: winnerID
            },
            cls: gameMessageTypes.FINISHED });
        await userService.removeClient(disconnectedID);
    };
}

const gameController = new GameController();
export default gameController;
