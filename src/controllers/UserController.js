import userService from '../services/UserService';

class UserController {

    async registerUser(req, res) {
        const [status, user] = await userService.registerUser(req.body);

        res.status(status);
        res.send(user);
        res.end();
    }

    async loginUser(req, res) {
        const [status, user] = await userService.loginUser(req.body);

        res.status(status);
        res.send(user);
        res.end();
    }

    async getUser(req, res) {
        const [status, user] = await userService.getUser(req.body);

        res.status(status);
        res.send(user);
        res.end();
    }
}

const userController = new UserController();
export default userController;