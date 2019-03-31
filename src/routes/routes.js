import userController from '../controllers/UserController';

const express = require('express');
const router = express.Router();

router.post('/user/signup', userController.registerUser);
router.post('/user/login', userController.loginUser);
router.post('/user/update', userController.updateUser);
router.get('/me', userController.getUser);
router.post('/user/signout', userController.signoutUser);
router.get('/users/:id');

export default router;
