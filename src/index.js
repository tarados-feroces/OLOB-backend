import router from './routes/routes';

const process = require('process');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session'); // Сессии
const mongoStore = require('connect-mongo')(session); // Хранилище сессий в монгодб

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(session({
    secret: 'i need more beers',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        url: 'mongodb://localhost:27017'
    })
}));

app.use('/', router);

app.listen(process.env.PORT || 5000, () => console.log('Example app listening on port 5000!'));
