import { userModel } from '../models'

class UserService {
    async registerUser(userData) {
        const conflictUser = await userModel.findOne({ email: userData.email, name: userData.name });

        if (conflictUser) {
            return [409, conflictUser];
        }
        
        const user = await userModel.create(userData);
        
        console.log(`user: ${user}`);
    
        return [201, user];
    }
    
    async loginUser(userData) {
        const user = await userModel.findOne({ userData });

        if (user) {
            return [200, user];
        }
    
        return [404, { message: 'User doesn`t exist' }];
    }
    
    async getUser(userData) {
        const user = await userModel.findOne({ email: userData.email, name: userData.name });

        if (user) {
            return [200, user];
        }
    
        return [404, { message: 'User doesn`t exist' }];
    }
}

const userService = new UserService();
export default userService;
