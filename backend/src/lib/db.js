import mongoose from "mongoose";

import { ENV } from "./env.js";

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    return mongoose.connection.asPromise();
  }

  const localFallbackUrl = process.env.DB_URL;

  try {
    if (!ENV.DB_URL) {
      console.warn(" DB is not defined in environment variables. Skipping MongoDB connection.");
      return null;
    }

    const conn = await mongoose.connect(ENV.DB_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(" Connected to MongoDB:", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB", error);

    if (ENV.DB_URL?.startsWith("mongodb+srv://")) {
      try {
        console.warn(`⚠️ Falling back to local MongoDB at ${localFallbackUrl}`);
        const fallbackConn = await mongoose.connect(localFallbackUrl, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(" Connected to local MongoDB:", fallbackConn.connection.host);
        return fallbackConn;
      } catch (fallbackError) {
        console.error("Error connecting to local MongoDB:", fallbackError);
      }
    }

    return null;
  }
};
