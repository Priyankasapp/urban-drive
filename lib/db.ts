import mongoose from "mongoose";
import { seedSuperAdmin } from "./seeder";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside your local .env configuration.",
  );
}

// Intercept hot-reloads in development environment
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: GlobalMongoose | undefined;
}

let cached = globalThis.mongooseCache;

if (!cached) {
  cached = globalThis.mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(async (instance) => {
        console.log("🚀 MongoDB Connected Successfully");

        // Auto-run your seeder upon clean connection
        await seedSuperAdmin();

        return instance;
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}
