import userService from '../services/UserService';

class UserController {
    async registerUser(req, res) {
        const [status, user] = await userService.registerUser(req.body);
        if (user) {
            req.session.user = { id: user._id, login: user.login };
        }
        res.status(status);
        res.send(user);
        res.end();
    }

    async loginUser(req, res) {
        const [status, user] = await userService.loginUser(req.body);
        if (user) {
            req.session.user = { id: user._id, login: user.login };
        }
        res.status(status);
        res.send(user);
        res.end();
    }

    async getUser(req, res) {
        if (req.session.user) {
            const [status, user] = await userService.getUser();
            res.status(status);
            res.send(user);
            res.end();
        } else {
            res.status(404);
            res.send({});
            res.end();
        }
    }

    async signoutUser(req, res) {
        if (req.session.user) {
            delete req.session.user;
            res.status(200);
            res.end();
        } else {
            res.status(404);
            res.end();
        }
    }
}

const userController = new UserController();
export default userController;
