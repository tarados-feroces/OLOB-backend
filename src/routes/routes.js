import userController from '../controllers/UserController';

const express = require('express');
const router = express.Router();

router.post('/api/user/signup', userController.registerUser);
router.post('/api/user/login', userController.loginUser);
router.post('/api/user/update', userController.updateUser);
router.get('/api/me', userController.getUser);
router.post('/api/user/signout', userController.signoutUser);
router.get('/api/users/:id');

export default router;
