import userController from './controllers/UserController';

const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/user/signup', userController.registerUser);
app.post('/user/signin', userController.loginUser);
app.get('/user/get', userController.getUser);

app.listen(process.env.PORT || 5000, () => console.log('Example app listening on port 5000!'));
