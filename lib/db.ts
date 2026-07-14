import mongoose from "mongoose";
import { seedSuperAdmin } from "./seeder";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside your local .env configuration.",
  );
}

// 1. Strict interface definition for the cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// 2. Safely declare the global cache variable for Next.js hot-reloads
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// 3. Fallback allocation using globalThis to prevent multiple connection pools
const cached: MongooseCache = globalThis.mongooseCache || {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  // If connection is already established, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If there is no active connection attempt, start a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(async (instance) => {
        console.log("🚀 MongoDB Connected Successfully");

        try {
          // Auto-run the super admin seeder
          await seedSuperAdmin();
        } catch (seederError) {
          console.error(
            "❌ Auto-seeder failed during DB connection:",
            seederError,
          );
        }

        return instance;
      });
  }

  try {
    // Await the connection promise
    cached.conn = await cached.promise;
  } catch (error: unknown) {
    // Reset the promise cache so the system can retry connection on subsequent requests
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
