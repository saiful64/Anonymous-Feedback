//next js db connection mongodb
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

type ConnectionObject = {
  isConnected?: number; // 0: disconnected, 1: connected    optional
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("DB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI!);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection error", error);
    process.exit(1);
  }
}

export default dbConnect;
