import userController from './controllers/UserController';

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session'); // Сессии
const MongoStore = require('connect-mongo')(session); // Хранилище сессий в монгодб

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('cookie-parser')());

app.post('/user/signup', userController.registerUser);
app.post('/user/signin', userController.loginUser);
app.get('/user/get', userController.getUser);

app.listen(process.env.PORT || 5000, () => console.log('Example app listening on port 5000!'));
