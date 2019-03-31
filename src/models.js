import { mongoose } from './DataBase';
import { gameSchema, userSchema } from './schemas';

export const userModel = mongoose.model('User', userSchema);
export const gameModel = mongoose.model('Game', gameSchema);
