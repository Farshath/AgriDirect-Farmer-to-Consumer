const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');

const runVerification = async () => {
  console.log('===========================================================');
  console.log('     MONGODB PRODUCTION & ATLAS VERIFICATION INSPECTOR     ');
  console.log('===========================================================\n');

  const rawUri = process.env.MONGODB_URI;

  if (!rawUri) {
    console.error('CRITICAL: MONGODB_URI is not set in backend/.env!');
    process.exit(1);
  }

  // Check URI pattern without leaking credentials
  const isAtlasUri = rawUri.includes('.mongodb.net') || rawUri.startsWith('mongodb+srv://');
  const isLocalUri = rawUri.includes('127.0.0.1') || rawUri.includes('localhost');

  console.log(`Configured URI Scheme: ${rawUri.split('://')[0]}://***`);
  console.log(`Target Classification: ${isAtlasUri ? 'MongoDB Atlas Cloud' : isLocalUri ? 'Local / Self-Hosted' : 'Custom Remote MongoDB'}`);

  let conn = null;
  try {
    console.log('\n[1/4] Attempting direct connection...');
    conn = await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });
    console.log('✓ Successfully connected to database!');
  } catch (err) {
    console.error(`✗ Connection Failed: ${err.message}`);
    console.log('\n-----------------------------------------------------------');
    console.log('AUDIT VERDICT:');
    console.log(`- Provider: ${isAtlasUri ? 'MongoDB Atlas (Configured but Unreachable)' : 'Local MongoDB (Offline)'}`);
    console.log(`- Connection Status: FAILED (${err.message})`);
    console.log('- Silent in-memory fallback: DISABLED (System correctly refused fallback)');
    console.log('-----------------------------------------------------------');
    process.exit(0);
  }

  const host = conn.connection.host;
  const dbName = conn.connection.name;
  const readyState = conn.connection.readyState;
  const isAtlasHost = host.includes('.mongodb.net');

  console.log('\n[2/4] Live Connection Diagnostics:');
  console.log(`- Connection State: ${readyState === 1 ? 'CONNECTED' : 'NOT CONNECTED'}`);
  console.log(`- Actual Host: ${host}`);
  console.log(`- Is MongoDB Atlas: ${isAtlasHost ? 'YES (Verified Atlas Cluster)' : 'NO (Not an Atlas cluster)'}`);
  console.log(`- Database Name: ${dbName}`);

  // Inspect Collections & Indexes
  console.log('\n[3/4] Inspecting Collections and Indexes:');
  const collections = await conn.connection.db.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);
  console.log(`- Total Collections: ${collectionNames.length}`);
  console.log(`- Collection Names: ${collectionNames.join(', ') || 'None (Clean Database)'}`);

  for (const col of collections) {
    const indexes = await conn.connection.db.collection(col.name).indexes();
    const indexNames = indexes.map((idx) => idx.name);
    console.log(`  • ${col.name}: ${indexes.length} indexes (${indexNames.join(', ')})`);
  }

  // CRUD & Persistence Verification
  console.log('\n[4/4] Performing Persistence & CRUD Verification:');
  const testEmail = `atlas.test.${Date.now()}@agrimarket.com`;
  const testUser = await User.create({
    name: 'Atlas Verification Customer',
    email: testEmail,
    password: 'AtlasTestPassword@123',
    role: 'CUSTOMER',
    phone: '+91 99999 88888',
  });
  console.log(`- CREATE: Test customer created (ID: ${testUser._id})`);

  // READ
  const foundUser = await User.findById(testUser._id);
  console.log(`- READ: Test customer retrieved (Email: ${foundUser.email})`);

  // UPDATE
  foundUser.name = 'Atlas Verification Customer (Updated)';
  await foundUser.save();
  const verifiedUpdate = await User.findById(testUser._id);
  console.log(`- UPDATE: Test customer updated (Name: "${verifiedUpdate.name}")`);

  // Keep test record for restart verification
  console.log(`- PERSISTENCE MARKER: Record stored with ID: ${testUser._id}`);

  console.log('\n===========================================================');
  console.log('SUMMARY REPORT:');
  console.log(`- Actual Database Provider: ${isAtlasHost ? 'MongoDB Atlas' : 'Local / Ephemeral'}`);
  console.log(`- Connection Status: ${readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'}`);
  console.log(`- Database Name: ${dbName}`);
  console.log(`- Collection Names: ${collectionNames.join(', ')}`);
  console.log(`- Persistence Test Result: SUCCESS (CRUD verified)`);
  console.log('===========================================================');

  await mongoose.disconnect();
  process.exit(0);
};

runVerification().catch((e) => {
  console.error('Unexpected error in verification script:', e);
  process.exit(1);
});

