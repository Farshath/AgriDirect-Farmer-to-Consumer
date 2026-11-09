const path = require('path');
const dotenv = require('dotenv');

// Ensure environment variables are loaded regardless of execution directory
const backendEnv = path.resolve(__dirname, '../../.env');
const localEnv = path.resolve(__dirname, '../.env');
if (require('fs').existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
} else if (require('fs').existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
} else {
  dotenv.config();
}

const mongoose = require('mongoose');

/**
 * MongoDB Atlas Production Database Connector
 * 
 * Rules enforced:
 * 1. Strictly requires process.env.MONGODB_URI.
 * 2. Validates that the URI begins with 'mongodb+srv://'.
 * 3. All local MongoDB and in-memory fallbacks are removed.
 * 4. Never exposes passwords or full connection strings.
 * 5. Uses target database: 'agri_marketplace'.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : '';

  if (!mongoUri) {
    const errorMsg = '[Database Error] Missing MONGODB_URI in environment configuration. Startup aborted.';
    console.error(errorMsg);
    process.exit(1);
  }

  // Validate that the URI begins with mongodb+srv://
  if (!mongoUri.startsWith('mongodb+srv://')) {
    const errorMsg = '[Database Error] Invalid URI: MONGODB_URI must begin with "mongodb+srv://" for MongoDB Atlas. Local and ephemeral fallbacks are disabled. Startup aborted.';
    console.error(errorMsg);
    process.exit(1);
  }

  console.log('[Database] Connecting to MongoDB Atlas...');

  try {
    const conn = await mongoose.connect(mongoUri, {
      dbName: 'agri_marketplace',
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    });

    console.log('[Database] MongoDB Atlas Connected Successfully');
    console.log(`[Database] Host: ${conn.connection.host}`);
    console.log(`[Database] Database: ${conn.connection.name}`);

    return conn;
  } catch (err) {
    console.error(`[Database Error] MongoDB Atlas connection failed: ${err.message}`);
    console.error('[Database Error] Please verify your MongoDB Atlas cluster hostname, credentials, and Network Access IP whitelist.');
    process.exit(1);
  }
};

/**
 * Safe database inspection helper (never leaks credentials)
 */
const getDatabaseMetadata = async () => {
  const conn = mongoose.connection;
  const isConnected = conn.readyState === 1;

  if (!isConnected) {
    return {
      connected: false,
      status: 'DISCONNECTED',
      provider: 'None',
      host: 'None',
      databaseName: 'None',
      collections: [],
    };
  }

  const host = conn.host || 'unknown';
  const isAtlas = host.includes('.mongodb.net');

  let collections = [];
  try {
    const rawCols = await conn.db.listCollections().toArray();
    collections = rawCols.map((c) => c.name);
  } catch (e) {
    collections = [];
  }

  return {
    connected: true,
    status: 'CONNECTED',
    provider: isAtlas ? 'MongoDB Atlas' : 'Non-Atlas MongoDB',
    host,
    databaseName: conn.name,
    collections,
  };
};

module.exports = connectDB;
module.exports.getDatabaseMetadata = getDatabaseMetadata;
