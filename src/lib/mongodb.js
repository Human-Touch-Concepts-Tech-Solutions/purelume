import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {}; // Keep empty - Atlas connection string handles SSL/TLS automatically

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase(dbName = process.env.MONGODB_DB) {
  const connectedClient = await clientPromise;
  const db = connectedClient.db(dbName);
  return { client: connectedClient, db };
}

export default clientPromise;