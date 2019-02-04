import { mongoose } from './DataBase';
import { userSchema } from './schemas';

export const userModel = mongoose.model('User', userSchema);
