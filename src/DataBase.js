export const mongoose = require('mongoose');
export const dbConnect = mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

export const db = mongoose.connection;

db.on('error', () => { throw new Error('Connection error') });
