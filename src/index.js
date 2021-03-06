import router from './routes/routes';

const process = require('process');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const cors = require('cors');
const http = require('http');
import wsServer from './server/WebSocketServer';

const whitelist = ['http://localhost:8080', 'http://130.193.34.42', 'http://130.193.34.42/api', 'electron://olob-app'];
const corsOptions = {
	credentials: true,
	origin: (origin, callback) => {
        if (whitelist.includes(origin)) {return callback(null, true)}
        callback(new Error('Not allowed by CORS'));
    }
};

// const corsOptions = {
//     credentials: true,
//     origin: '*'
// };
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ limit: '5mb', extended: true, parameterLimit: 5000 }));
app.use(bodyParser.json({ limit: '5mb' }));

app.use(require('cookie-parser')());
const sessionParser = session({
    secret: 'i need more beers',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        url: 'mongodb://localhost:27017/test',
        touchAfter: 24 * 3600
    })
});

app.use(sessionParser);

app.use('/', router);

const server = http.createServer(app);
wsServer.start(sessionParser, server);

server.listen(process.env.PORT || 5000, () => console.log('Example app listening on port 5000!'));
