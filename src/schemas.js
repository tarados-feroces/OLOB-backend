import { mongoose } from './DataBase';

export const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:[true, 'emailRequired'],
        maxlength:[32, 'tooLong'],
        minlength:[2, 'tooShort'],
        // match:[/^[.]+$/,"email"], //сделать норм регулярку на email
        unique:true
    },
    name: String,
    password: {
        type:String,
        required:[true, 'passwordRequired'],
        maxlength:[32, 'tooLong'],
        minlength:[2, 'tooShort'],
    }
});
