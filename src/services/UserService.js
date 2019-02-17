import { userModel } from '../models'

class UserService {
    async registerUser(userData) {

        const conflictUser = await userModel.findOne({ email: userData.email });

        if (conflictUser) {
            return [409, conflictUser];
        }
        
        const user = await userModel.create(userData);
        
        console.log(`users: ${user}`);

        return [201, user];
    }
    
    async loginUser(userData) {
        const user = await userModel.findOne({ email: userData.email, password: userData.password });

        if (user) {
            return [200, user];
        }
    
        return [404, { message: 'User doesn`t exist' }];
    }
    
    async getUser() {
        const user = await userModel.find();

        if (user) {
            return [200, user];
        }
    
        return [404, { message: 'User doesn`t exist' }];
    }
}

const userService = new UserService();
export default userService;
