require('dotenv').config();
const mongoose = require('mongoose');

const mongoDBUri = process.env.MONGO_URI_DOCKER;

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongoDBUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw new Error('Database connection failed');
    }
};

module.exports = connectToMongoDB;
