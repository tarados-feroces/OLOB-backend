import { mongoose } from './DataBase';

export const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true, 'loginRequired'],
        maxlength: [32, 'tooLong'],
        minlength: [2, 'tooShort'],
        // match:[/^[.]+$/,"email"], //сделать норм регулярку на login
        unique: true
    },
    email: {
        type: String,
        required: [true, 'emailRequired'],
        maxlength: [32, 'tooLong'],
        minlength: [2, 'tooShort']
        // match:[/^[.]+$/,"email"], //сделать норм регулярку на email
        // unique: true
    },
    name: String,
    password: {
        type: String,
        required: [true, 'passwordRequired'],
        maxlength: [32, 'tooLong'],
        minlength: [2, 'tooShort']
    },
    avatar: String
});

export const gameSchema = new mongoose.Schema({
    playerID1: {
        type: String,
        unique: true
    },
    playerID2: {
        type: String,
        unique: true
    },
    partyID: {
        type: String
    }
});
