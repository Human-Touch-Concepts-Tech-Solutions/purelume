'use server';

import clientPromise, { connectToDatabase } from '@/lib/mongodb';

export async function runMongoDiagnosticAction() {
  const logs = [];

  try {
    logs.push("1. Checking Environment Variables...");
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in process.env / .env.local");
    }
    
    // Mask URI for safe output
    const maskedUri = process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@');
    logs.push(`   URI detected: ${maskedUri}`);

    logs.push("2. Attempting clientPromise connection...");
    const client = await clientPromise;
    logs.push("   Connected successfully to MongoDB client instance.");

    logs.push("3. Running Ping Command on Admin DB...");
    const adminDb = client.db('admin');
    const pingResult = await adminDb.command({ ping: 1 });
    logs.push(`   Ping Response: ${JSON.stringify(pingResult)}`);

    logs.push("4. Testing Write Operation on 'products' collection...");
    const { db } = await connectToDatabase();
    const testDoc = {
      test_id: `diag_${Date.now()}`,
      message: "MongoDB connection test successful!",
      createdAt: new Date(),
    };

    const insertResult = await db.collection('products').insertOne(testDoc);
    logs.push(`   Inserted Document ID: ${insertResult.insertedId.toString()}`);

    return {
      success: true,
      logs,
      insertedId: insertResult.insertedId.toString(),
    };
  } catch (error) {
    console.error("[Mongo Diagnostic Error]:", error);
    logs.push(`❌ ERROR ENCOUNTERED: ${error.name} - ${error.message}`);
    
    if (error.code) logs.push(`   Error Code: ${error.code}`);
    if (error.cause) logs.push(`   Cause: ${JSON.stringify(error.cause)}`);

    return {
      success: false,
      logs,
      error: error.message,
      stack: error.stack,
    };
  }
}