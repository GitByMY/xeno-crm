import mongoose from 'mongoose';

// Environment variables with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://as5138:Jq7h3DahtbX4XIps@cluster0.bw2rbvf.mongodb.net/crm?retryWrites=true&w=majority';

// Check if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Global is used here to maintain a cached connection across hot reloads in development
// and to prevent connections growing exponentially in development due to API Route hot reloading
// https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.js
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  // If not, create a new promise if one doesn't exist already
  if (!cached.promise) {
    console.log('Creating new database connection');
    
    // Connection options
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    };

    // Enable Debug mode in development
    if (!isProduction) {
      mongoose.set('debug', true);
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null; // Reset promise so we can retry
        throw error;
      });
  } else {
    console.log('Using existing connection promise');
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Connection promise rejected:', error);
    // Reset cache to allow for another attempt
    cached.promise = null;
    throw error;
  }
}

// Create schemas
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  totalSpend: { type: Number, default: 0 },
  lastOrderDate: { type: Date, default: null },
  visitCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const ruleSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { type: String, required: true },
  value: { type: String, required: true },
  logicGate: { type: String },
}, { _id: false });

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  audienceQuery: [ruleSchema],
  createdAt: { type: Date, default: Date.now },
  summary: { type: String },
});

// Check if models already exist to prevent overwriting
export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
export const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema); 