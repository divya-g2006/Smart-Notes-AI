import dotenv from "dotenv";
import mongoose from "mongoose";
import UserModel from "../models/user.model.js";

dotenv.config();

const run = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL missing in environment");
  }

  await mongoose.connect(process.env.MONGODB_URL);

  const result = await UserModel.updateMany(
    {
      $or: [{ credits: { $exists: false } }, { credits: null }, { credits: 0 }],
    },
    { $set: { credits: 50 } }
  );

  console.log(
    `[migration] Matched=${result.matchedCount ?? result.n} Modified=${result.modifiedCount ?? result.nModified}`
  );

  await mongoose.disconnect();
};

run().catch(async (e) => {
  console.error("[migration] Failed:", e);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});

