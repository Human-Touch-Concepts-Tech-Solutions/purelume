import { MongoClient } from 'mongodb';

const options = {};

let client;
let clientPromise;

function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please add your MONGODB_URI to environment variables.');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function connectToDatabase(dbName = process.env.MONGODB_DB) {
  const promise = getClientPromise();
  const connectedClient = await promise;
  const db = connectedClient.db(dbName);
  return { client: connectedClient, db };
}

export default function getMongoPromise() {
  return getClientPromise();
}