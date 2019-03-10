import router from './routes/routes';

const process = require('process');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session'); // Сессии
const mongoStore = require('connect-mongo')(session); // Хранилище сессий в монгодб
const cors = require('cors');

const whitelist = ['http://localhost:8080'];
const corsOptions = {
	credentials: true,
	origin: (origin, callback) => {
    if (whitelist.includes(origin)) {return callback(null, true)}

      callback(new Error('Not allowed by CORS'));
  }
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('cookie-parser')());
app.use(session({
    secret: 'i need more beers',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        url: 'mongodb://localhost:27017'
    }),
    cookie: { maxAge: 60000 }
}));

app.use('/', router);

// const WebSocketServer = require('ws');
//
// // подключенные клиенты
// const clients = {};
//
// // WebSocket-сервер на порту 5001
// const webSocketServer = new WebSocketServer.Server({
//     port: 5001
// });
// webSocketServer.on('connection', );

app.listen(process.env.PORT || 5000, () => console.log('Example app listening on port 5000!'));
