'use strict';
import gameController from '../controllers/GameController';
import userService from '../services/UserService';

class WebSocketServer {
    constructor() {
        this.start = this.start.bind(this);
    }

    start(sessionParser, server) {
        const WebSocketServer = require('ws');

        const webSocketServer = new WebSocketServer.Server({
            server,
            verifyClient: (info, done) => {
                sessionParser(info.req, {}, () => {
                    done(info.req.session.user);
                });
            }
        });

        webSocketServer.on('connection', (ws, req) => {
            userService.addClient(req.session.user.id, ws);
            console.log(`new connection: ${req.session.user.login}`);

            ws.on('message', (message) => {
                console.log(`message received ${message}`);
                const data = JSON.parse(message);
                gameController.messageHandlers[data.cls](data.data, req);
            });

            ws.on('close', () => {
                console.log(`connection closed ${req.session.user.login}`);
                delete userService.removeClient(req.session.user.id);
            });
        });
    }
}

const webSocketController = new WebSocketServer();
export default webSocketController;
