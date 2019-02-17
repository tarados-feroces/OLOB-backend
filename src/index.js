import userController from './controllers/UserController';

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
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

app.post('/user/signup', userController.registerUser);
app.post('/user/login', userController.loginUser);
app.get('/me', userController.getUser);
app.post('/user/signout', userController.signoutUser);

app.listen(process.env.PORT || 5000, () => console.log('Example app listening on port 5000!'));
