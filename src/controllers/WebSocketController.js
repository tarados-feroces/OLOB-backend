// export const webSocketServer = (ws) => {
//     const id = Math.random();
//     clients[id] = ws;
//     console.log(`new conn ${id}`);
//
//
//     ws.on('message', function(message) {
//         console.log(`message received ${message}`);
//
//         for (const key in clients) {
//             clients[key].send(message);
//         }
//     });
//
//     ws.on('close', function() {
//         console.log(`conn closed ${id}`);
//         delete clients[id];
//     });
// };
