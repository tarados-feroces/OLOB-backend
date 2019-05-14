'use strict';

import userService from '../services/UserService';
import { DEFAULT_AVATAR } from '../constants/UserConstants';
import partyService from '../services/PartyService';
import gameService from '../services/GameService';

class UserController {
    constructor() {
        this.getCurrentGame = this.getCurrentGame.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.getUser = this.getUser.bind(this);
    }

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

    async getCurrentGame(req) {
        const party = partyService.getCurrentParty(req);
        const opponent = party ?
            await userService.getUser(party.playerID1 === req.session.user.id ? party.playerID2 : party.playerID1) :
            [];

        return party ? {
            fen: party.game.fen(),
            messages: party.messages,
            steps: party.steps,
            opponent: opponent[1],
            situation: {},
            currentUser: gameService.getCurrentUser(party.game) === 'b' ? party.playerID2 : party.playerID1,
            side: party.playerID1 === req.session.user.id ? 0 : 1
        } : null;
    }

    async loginUser(req, res) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        const [status, user] = await userService.loginUser(req.body);
        if (user) {
            req.session.user = { id: user._id, login: user.login };
        }
        user.password = undefined;
        const game = await this.getCurrentGame(req);
        const games = [];

        for (let item = 0; item < user.games.length; item++) {
            const opponent = await userService.getUser(user.games[item].opponent);
            const opponentData = { login: opponent[1].login, avatar: opponent[1].avatar };
            console.log(user.games[item]);
            games.push({ winner: user.games[item].winner, side: user.games[item].side, opponent: opponentData });
        }

        const newUser = {};
        newUser.login = user.login;
        newUser.avatar = user.avatar;
        newUser.email = user.email;
        newUser.games = games;
        res.status(status);

        res.send({ user: newUser, game });
        res.end();
    }

    async getUser(req, res) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        if (req.session.user) {
            const [status, user] = await userService.getUser(req.session.user.id);
            const game = await this.getCurrentGame(req);
            const games = [];

            for (let item = 0; item < user.games.length; item++) {
                const opponent = await userService.getUser(user.games[item].opponent);
                const opponentData = { login: opponent[1].login, avatar: opponent[1].avatar };
                console.log(user.games[item]);
                games.push({ winner: user.games[item].winner, side: user.games[item].side, opponent: opponentData });
            }

            const newUser = {};
            newUser.login = user.login;
            newUser.avatar = user.avatar;
            newUser.email = user.email;
            newUser.games = games;
            res.status(status);

            res.send({ user: newUser, game });
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

    async updateUserAvatar(req, res) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        if (req.session.user) {
            const avatar = await userService.cropUserAvatar(req.body.avatar, req.body.options);
            res.status(200);
            res.send({ avatar });
            res.end();
        } else {
            res.status(409);
            res.end();
        }
    }

    async signoutUser(req, res) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        if (req.session.user) {
            userService.getClients()[req.session.user.id].isAlive = false;
            req.session.user = undefined;
            res.status(200);
            res.end();
        } else {
            res.status(409);
            res.end();
        }
    }

    async getUserGames(req, res) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        if (req.session.user) {
            const [status, games] = await userService.getUserGames(req.session.user.id);
            res.status(status);
            res.send({ games });
            res.end();
        } else {
            res.status(409);
            res.end();
        }
    }
}

const userController = new UserController();
export default userController;
