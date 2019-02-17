import { userModel } from '../models';

class UserService {
    async registerUser(userData) {
        const conflictUser = await userModel.findOne({ login: userData.login });

        if (conflictUser) {
            return [409, conflictUser];
        }

        const user = await userModel.create(userData);
        console.log(`users: ${user}`);

        return [201, user];
    }

    async loginUser(userData) {
        const user = await userModel.findOne({ login: userData.login, password: userData.password });

        if (user) {
            return [200, user];
        }

        return [404, { message: 'User doesn`t exist' }];
    }

    async getUser(id) {
        const user = await userModel.findOne(id);

        if (user) {
            return [200, user];
        }

        return [404, { message: 'User doesn`t exist' }];
    }

    // checkUser(userData) {
    //     return User
    //         .findOne({ login: userData.login })
    //         .then(function(doc) {
    //             if (doc.password == hash(userData.password)) {
    //                 console.log('User password is ok');
    //                 return Promise.resolve(doc);
    //             } else {
    //                 return Promise.reject('Error wrong');
    //             }
    //         });
    // }
    //
    // static hash(text) {
    //     return crypto.createHash('sha1')
    //         .update(text).digest('base64');
    // }
}

const userService = new UserService();
export default userService;
