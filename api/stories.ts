// Import Dependencies
import { NowRequest, NowResponse } from "@vercel/node";
import * as url from "url";
import { MongoClient, Db } from "mongodb";

// Create cached connection variable
let cachedDb: Db = null;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri: string) {
  console.log(`uri: ${uri}`);
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(url.parse(uri).pathname.substr(1));

  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
}

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
module.exports = async (req: NowRequest, res: NowResponse) => {
  // Get a database connection, cached or otherwise,
  // using the connection string environment variable as the argument
  const db = await connectToDatabase(process.env.MONGODB_URI);

  // Select the "stories" collection from the database
  const collection = await db.collection("stories");

  // Select the users collection from the database
  const stories = await collection.find({}).limit(5).toArray();

  // Respond with a JSON string of all users in the collection
  res.status(200).json({ stories });
};
