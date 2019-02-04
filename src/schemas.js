import { mongoose } from './DataBase';

export const userSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String
})