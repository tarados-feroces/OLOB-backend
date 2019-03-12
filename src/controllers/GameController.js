'use strict';

class GameController {
    constructor() {
        this.gameQueue = [];
        this.clients = {};
        this.parties = {};

        this.startGame = this.startGame.bind(this);
        this.handleGame = this.handleGame.bind(this);

        this.messageTypes = {
            init: this.startGame,
            game: this.handleGame
        };
    }

    startGame(message, req) {
        const nextPlayer = this.gameQueue.shift();
        if (!nextPlayer) {
            this.gameQueue.push(req.session.user.login);
        } else {
            const answer = JSON.stringify({
                message: 'PLAY!',
                cls: 'GAME_INITED'
            });
            this.clients[req.session.user.login].send(answer);
            this.clients[nextPlayer].send(answer);
            this.parties[10] = {
                first: nextPlayer,
                second: req.session.user.login
            };
        }
    }

    handleGame(message, req) {
        this.clients[this.parties[message.gameID].first].send(JSON.stringify(message));
        this.clients[this.parties[message.gameID].second].send(JSON.stringify(message));
    }
}

const gameController = new GameController();
export default gameController;
