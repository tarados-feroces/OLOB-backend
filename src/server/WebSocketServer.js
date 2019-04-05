'use strict';
import gameController from '../controllers/GameController';
import userService from '../services/UserService';
import partyService from '../services/PartyService';

class WebSocketServer {
    constructor() {
        this.start = this.start.bind(this);
    }

    noop = () => {};

    heartbeat = (ws) => {
        ws.isAlive = true;
    };

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
            ws.isAlive = true;
            ws.on('pong', this.heartbeat.bind(this, ws));
            userService.addClient(req.session.user.id, ws);
            console.log(`new connection: ${req.session.user.login}`);

            ws.on('message', (message) => {
                console.log(`message received ${message}`);
                const data = JSON.parse(message);
                gameController.messageHandlers[data.cls](data.data, req);
            });

            ws.on('close', () => {
                console.log(`connection closed ${req.session.user.login}`);
                userService.removeClient(req.session.user.id);
            });
        });

        setInterval(() => {
            const clients = userService.getClients();
            Object.keys(clients).forEach((clientID) => {
                const ws = clients[clientID];
                if (ws.isAlive === false) {
                    console.log('opp dis');
                    if (partyService.getUserParty(clientID)) {
                        gameController.sendOpponentDisconnect(clientID);
                    }
                    return ws.terminate();
                }

                ws.isAlive = false;
                ws.ping(this.noop());
            });
        }, 1000);
    }
}

const webSocketController = new WebSocketServer();
export default webSocketController;
