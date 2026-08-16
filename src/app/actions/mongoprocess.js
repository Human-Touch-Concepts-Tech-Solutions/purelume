'use server';

import clientPromise from '@/lib/mongodb';

/**
 * Dynamic Server Action to insert single or batch data into any MongoDB collection.
 *
 * @param {string} collectionName - The target MongoDB collection name.
 * @param {Object|Array} data - Single document object OR array of document objects for batch insertion.
 * @param {string} [dbName] - Optional database name override.
 */
export async function insertData(collectionName, data, dbName) {
  try {
    if (!collectionName || typeof collectionName !== 'string') {
      throw new Error('A valid collection name is required.');
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new Error('Data payload cannot be empty.');
    }

    const client = await clientPromise;
    // Uses default database specified in MONGODB_URI connection string unless dbName is passed
    const db = dbName ? client.db(dbName) : client.db();
    const collection = db.collection(collectionName);

    // Timestamp metadata attached to inserted documents
    const timestamp = new Date();

    if (Array.isArray(data)) {
      const preparedBatch = data.map((item) => ({
        ...item,
        createdAt: item.createdAt || timestamp,
        updatedAt: timestamp,
      }));

      const result = await collection.insertMany(preparedBatch);

      return {
        success: true,
        insertedCount: result.insertedCount,
        insertedIds: Object.values(result.insertedIds).map((id) => id.toString()),
      };
    } else {
      const preparedItem = {
        ...data,
        createdAt: data.createdAt || timestamp,
        updatedAt: timestamp,
      };

      const result = await collection.insertOne(preparedItem);

      return {
        success: true,
        insertedCount: 1,
        insertedId: result.insertedId.toString(),
      };
    }
  } catch (error) {
    console.error(`[MongoProcess Error - ${collectionName}]:`, error);
    return {
      success: false,
      error: error.message || 'Database insertion failed.',
    };
  }
}