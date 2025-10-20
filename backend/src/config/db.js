const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URL, {
            dbName: process.env.DB_NAME,
        });
        console.log('MongoDB connected successfully: ' + process.env.DB_NAME);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
