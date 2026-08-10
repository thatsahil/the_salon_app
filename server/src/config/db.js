const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.warn('⚠️ MONGODB_URI not found in environment. Running in mock/in-memory database mode.');
    return false;
  }

  try {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully.');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.warn('⚠️ Falling back to in-memory store mode for local execution.');
    return false;
  }
}

function getIsConnected() {
  return isConnected;
}

module.exports = {
  connectDB,
  getIsConnected,
};
