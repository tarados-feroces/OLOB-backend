'use strict';

class WebSocketController {
    start() {
        const WebSocketServer = require('ws');

        const clients = {};

        const webSocketServer = new WebSocketServer.Server({
            port: 5001
        });
        webSocketServer.on('connection', (ws, request) => {
            const id = Math.random();
            clients[id] = ws;
            console.log(`new connection: ${id}`);
            // console.log(request);

            ws.on('message', function(message) {
                console.log(`message received ${message}`);

                for (const key in clients) {
                    clients[key].send(message);
                }
            });

            ws.on('close', function() {
                console.log(`conn closed ${id}`);
                delete clients[id];
            });
        });
    }
}

const webSocketController = new WebSocketController();
export default webSocketController;
