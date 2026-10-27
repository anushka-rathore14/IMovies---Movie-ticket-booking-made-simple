const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log('⚡ No MONGODB_URI provided. Initializing in-memory MongoDB fallback...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        console.log(`✅ In-Memory MongoDB server started at: ${uri}`);
      } catch (memErr) {
        console.warn('⚠️ mongodb-memory-server not available. Attempting local default mongodb://127.0.0.1:27017/imovies');
        uri = 'mongodb://127.0.0.1:27017/imovies';
      }
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`🚀 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // If external URI failed and we haven't tried in-memory yet, fallback in dev
    if (!mongod && process.env.NODE_ENV !== 'production') {
      try {
        console.log('🔄 Attempting fallback to in-memory MongoDB...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`✅ In-Memory fallback connected: ${conn.connection.host}`);
        return conn;
      } catch (fallbackErr) {
        console.error('❌ In-memory fallback failed:', fallbackErr.message);
      }
    }
    throw error;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, disconnectDB };
