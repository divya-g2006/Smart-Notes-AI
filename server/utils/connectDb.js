import mongoose from "mongoose";
import { ensureDefaultAdmin } from "./ensureAdmin.js";

const normalizeEnvValue = (value) => {
  if (value === undefined || value === null) return "";
  const trimmed = String(value).trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDb = async ({ retries = 5 } = {}) => {
  const mongoUrl = normalizeEnvValue(process.env.MONGODB_URL);

  if (!mongoUrl) {
    console.error("[db] Missing env var MONGODB_URL");
    return false;
  }

  const options = {
    // Atlas expects TLS; mongoose enables it automatically for mongodb+srv,
    // but we keep it explicit for clarity.
    tls: true,

    // Avoid hanging forever on unreachable clusters.
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,

    // Prefer IPv4 on networks where IPv6 causes timeouts.
    family: 4,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(mongoUrl, options);
      console.log("[db] Connected");
      await ensureDefaultAdmin();
      return true;
    } catch (error) {
      const message = error?.message || String(error);
      console.error(`[db] Connection failed (attempt ${attempt}/${retries}):`, message);

      // Helpful hints for the common Atlas ETIMEDOUT case.
      if (String(message).includes("ETIMEDOUT")) {
        console.error(
          "[db] Hint: Atlas Network Access must allow your IP (or 0.0.0.0/0 for testing), and the cluster must be running."
        );
      }

      if (attempt < retries) {
        await sleep(Math.min(1000 * 2 ** (attempt - 1), 8000));
      }
    }
  }

  return false;
};

export default connectDb;
