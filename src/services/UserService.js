import { userModel } from '../models';
import crypto from 'crypto';

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
        console.log('send: ', id);
        console.log(Object.keys(this.clients));
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

    async conflictByLoginOrEmail(login, email) {
        const conflictUser = await userModel.findOne({ $or: [{ login }, { email }] });
        return !conflictUser;
    }

    hash(text) {
        const res = crypto.createHash('sha1').update(text).digest('base64');
        console.log(res);
        return res;
    }
}

const userService = new UserService();
export default userService;
