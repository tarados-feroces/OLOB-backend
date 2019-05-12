import { userModel } from '../models';
import crypto from 'crypto';
import btoa from 'btoa';
import sharp from 'sharp';
import { Buffer } from 'buffer';

class UserService {
    constructor() {
        this.clients = {};
    }

    addClient(id, ws) {
        console.log('add: ', id);
        this.clients[id] = ws;
    }

    getClients() {
        return this.clients;
    }

    async removeClient(id) {
        delete this.clients[id];
    }

    async sendMessage(id, message) {
        await this.clients[id].send(JSON.stringify(message));
    }

    async signupUser(userData) {
        userData.password = this.hash(userData.password);
        const conflictUser = await userModel.findOne({ $or: [{ login: userData.login }, { email: userData.email }] });

        if (conflictUser) {
            return [409, conflictUser];
        }

        const user = await userModel.create(userData);

        return [201, user];
    }

    async loginUser(userData) {
        const user = await userModel.findOne({ login: userData.login, password: this.hash(userData.password) });

        if (user) {
            return [200, user];
        }

        return [404, { message: 'User doesn`t exist' }];
    }

    async getUser(id) {
        const user = await userModel.findById(id);

        if (user) {
            user.password = undefined;
            return [200, user];
        }

        return [404, { message: 'User doesn`t exist' }];
    }

    async updateUser(_id, data) {
        const user = await userModel.findOne({ _id });

        if (user) {
            for (const prop in data) {
                user[prop] = data[prop];
            }
            await user.save();
            return [200, user];
        }

        return [404, { message: 'User doesn`t exist' }];
    }

    async getUserGames(_id) {
        const user = await userModel.findOne({ _id });

        if (user) {
            return [200, user.games];
        }

        return [404, { message: 'User doesn`t exist' }];
    }

    async addUserGame(_id, game) {
        const user = await userModel.findOne({ _id });

        if (user) {
            user.games.push(game);
            user.save();
            return [200, user];
        }

        return [404, { message: 'User doesn`t exist' }];
    }

    async conflictByLoginOrEmail(login, email) {
        const conflictUser = await userModel.findOne({ $or: [{ login }, { email }] });
        return !conflictUser;
    }

    hash(text) {
        const res = crypto.createHash('sha1').update(text).digest('base64');
        return res;
    }

    async cropUserAvatar(avatar, options) {
        if (!Object.keys(options).length) {
            return avatar;
        }

        const croppedAvatar = avatar.replace(/.*;base64,/, '');
        const data = Buffer.from(croppedAvatar, 'base64');
        let newAvatar = await sharp(data)
            .extract(options)
            .png()
            .toBuffer();

        return `data:image/png;base64,${this._arrayBufferToBase64(newAvatar)}`;
    }

     _arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[ i ]);
        }
        return btoa(binary);
    }
}

const userService = new UserService();
export default userService;
