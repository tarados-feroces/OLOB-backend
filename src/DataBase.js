export const mongoose = require('mongoose');
export const dbConnect = mongoose.connect('mongodb://localhost:27017');

export const db = mongoose.connection;

db.on('error', () => { throw new Error('Connection error') });
