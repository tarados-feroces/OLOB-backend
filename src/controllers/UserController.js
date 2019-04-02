'use strict';

import userService from '../services/UserService';
import { DEFAULT_AVATAR } from '../constants/UserConstants';
import partyService from "../services/PartyService";

class UserController {
    async registerUser(req, res) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        const [status, user] = await userService.signupUser({ ...req.body, avatar: DEFAULT_AVATAR });
        if (user) {
            req.session.user = { id: user._id, login: user.login };
        }
        user.password = undefined;
        res.status(status);
        res.send(user);
        res.end();
    }

    async loginUser(req, res) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        const [status, user] = await userService.loginUser(req.body);
        if (user) {
            req.session.user = { id: user._id, login: user.login };
        }
        user.password = undefined;
        res.status(status);
        res.send(user);
        res.end();
    }

    async getUser(req, res) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        console.log(req.session.user);
        if (req.session.user) {
            const [status, user] = await userService.getUser(req.session.user.id);
            const party = partyService.getCurrentParty(req);
            console.log(party);
            const game = party ? {
                opponent: { ...await userService.getUser(partyService.getEnemyOfUser(req))[1]},
                fen: party.game,
                situation: {},
                currentUser: user._id,
                side: party.playerID1 === user._id ? 0 : 1
            } : {};
            res.status(status);

            res.send({ user, game });
            res.end();
        } else {
            console.log('no session');
            res.status(404);
            res.send({});
            res.end();
        }
    }

    async updateUser(req, res) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        let allowUpdating = true;
        if (req.body.login || req.body.email) {
            allowUpdating = await userService.conflictByLoginOrEmail(req.body.login, req.body.email);
        }

        if (allowUpdating) {
            const [status, user] = await userService.updateUser(req.session.user.id, req.body);
            if (user && req.body.login) {
                req.session.user = { id: user._id, login: user.login };
            }
            user.password = undefined;
            res.status(status);
            res.send(user);
        } else {
            res.status(409);
        }

        res.end();
    }

    async signoutUser(req, res) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        if (req.session.user) {
            req.session.user = undefined;
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
