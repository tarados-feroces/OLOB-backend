'use strict';
import gameController from './GameController';

class WebSocketController {
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
            gameController.clients[req.session.user.login] = ws;
            console.log(`new connection: ${req.session.user.login}`);

            ws.on('message', (message) => {
                console.log(`message received ${message}`);
                const data = JSON.parse(message);
                gameController.messageTypes[data.cls](data, req);
            });

            ws.on('close', () => {
                console.log(`connection closed ${req.session.user.login}`);
                delete gameController.clients[req.session.user.login];
            });
        });
    }
}

const webSocketController = new WebSocketController();
export default webSocketController;
