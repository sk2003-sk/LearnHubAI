import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 15000,
    ...(config.mongoDb ? { dbName: config.mongoDb } : {}),
  });
  console.log(`[db] connected to ${mongoose.connection.name}`);
}
