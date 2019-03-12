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
            GAME_INITED: this.handleGame
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
            this.parties['lol'] = {
                first: nextPlayer,
                second: req.session.user.login
            };
        }
    }

    handleGame(data, req) {
        console.log(data);
        console.log(this.parties[data.message.gameID]);

        this.clients[this.parties[data.message.gameID].first].send(JSON.stringify(data));
        this.clients[this.parties[data.message.gameID].second].send(JSON.stringify(data));
    }
}

const gameController = new GameController();
export default gameController;
