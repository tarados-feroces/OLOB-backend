import router from './routes/routes';

const process = require('process');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session'); // Сессии
const mongoStore = require('connect-mongo')(session); // Хранилище сессий в монгодб
const cors = require('cors');
const http = require('http');
import wsServer from './server/WebSocketServer';

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
const sessionParser = session({
    secret: 'i need more beers',
    saveUninitialized: false,
    resave: false,
    store: new mongoStore({
        url: 'mongodb://localhost:27017'
    }),
    cookie: { maxAge: 60000 }
});
app.use(sessionParser);

app.use('/', router);

const server = http.createServer(app);
wsServer.start(sessionParser, server);

server.listen(process.env.PORT || 5000, () => console.log('Example app listening on port 5000!'));
