import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import AdminModel from "../models/admin.model.js";
import Payment from "../models/payment.model.js";
import UserModel from "../models/user.model.js";

dotenv.config();

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

const getAdminJwtSecret = () => process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET;

const setAdminCookie = (res, token) => {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "admin_token";
  const isProd = String(process.env.NODE_ENV || "").toLowerCase() === "production";
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const secret = getAdminJwtSecret();
    if (!secret) {
      return res.status(500).json({ message: "Missing JWT_SECRET/ADMIN_JWT_SECRET" });
    }

    const loginEmail = normalizeEnvValue(email).toLowerCase();
    const loginPassword = normalizeEnvValue(password);
    if (!loginEmail || !loginPassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await AdminModel.findOne({ email: loginEmail });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(loginPassword, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id }, secret, { expiresIn: "7d" });
    setAdminCookie(res, token);

    return res.status(200).json({ message: "Admin login successful", email: admin.email });
  } catch {
    return res.status(500).json({ message: "Login failed" });
  }
};

export const changeAdminAccount = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const updates = {};
    const nextEmail = normalizeEnvValue(email).toLowerCase();
    const nextPassword = normalizeEnvValue(password);

    if (nextEmail) updates.email = nextEmail;
    if (nextPassword) updates.passwordHash = await bcrypt.hash(nextPassword, 10);

    if (!updates.email && !updates.passwordHash) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const admin = await AdminModel.findByIdAndUpdate(req.adminId, updates, { new: true });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    return res.status(200).json({ message: "Admin account updated", email: admin.email });
  } catch (e) {
    const dup = String(e?.code) === "11000";
    return res.status(dup ? 409 : 500).json({ message: dup ? "Email already in use" : "Update failed" });
  }
};

export const listPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "pending" })
      .sort({ createdAt: 1 })
      .populate("userId", "name email")
      .lean();

    return res.status(200).json({ payments });
  } catch {
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
};

export const approvePendingPayment = async (req, res) => {
  const paymentId = req.params.id;
  const session = await mongoose.startSession();
  try {
    let result = null;
    await session.withTransaction(async () => {
      const payment = await Payment.findOneAndUpdate(
        { _id: paymentId, status: "pending" },
        { $set: { status: "approved", decidedAt: new Date() } },
        { new: true, session }
      ).populate("userId", "name email credits");

      if (!payment) {
        const existing = await Payment.findById(paymentId).populate("userId", "name email credits").session(session);
        if (!existing) {
          const err = new Error("Payment not found");
          err.statusCode = 404;
          throw err;
        }
        if (existing.status === "approved") {
          result = { payment: existing, already: true };
          return;
        }
        if (existing.status === "rejected") {
          const err = new Error("Payment already rejected");
          err.statusCode = 400;
          throw err;
        }
        const err = new Error("Payment could not be approved");
        err.statusCode = 409;
        throw err;
      }

      const creditsToAdd = Number(payment.credits);
      if (!Number.isFinite(creditsToAdd) || creditsToAdd <= 0) {
        const err = new Error("Invalid payment credits");
        err.statusCode = 400;
        throw err;
      }

      const user = await UserModel.findByIdAndUpdate(
        payment.userId?._id || payment.userId,
        { $inc: { credits: creditsToAdd } },
        { new: true, session }
      ).lean();

      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }

      result = { payment, user, already: false };
    });

    return res.status(200).json({
      message: result?.already ? "Already approved" : "Payment approved",
      payment: result?.payment,
      user: result?.user,
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Approve failed" });
  } finally {
    session.endSession();
  }
};

export const rejectPendingPayment = async (req, res) => {
  const paymentId = req.params.id;
  const session = await mongoose.startSession();
  try {
    let result = null;
    await session.withTransaction(async () => {
      const payment = await Payment.findOneAndUpdate(
        { _id: paymentId, status: "pending" },
        { $set: { status: "rejected", decidedAt: new Date() } },
        { new: true, session }
      ).populate("userId", "name email credits");

      if (!payment) {
        const existing = await Payment.findById(paymentId).populate("userId", "name email credits").session(session);
        if (!existing) {
          const err = new Error("Payment not found");
          err.statusCode = 404;
          throw err;
        }
        if (existing.status === "rejected") {
          result = { payment: existing, already: true };
          return;
        }
        if (existing.status === "approved") {
          const err = new Error("Payment already approved (cannot reject)");
          err.statusCode = 400;
          throw err;
        }
        const err = new Error("Payment could not be rejected");
        err.statusCode = 409;
        throw err;
      }

      result = { payment, already: false };
    });

    return res.status(200).json({
      message: result?.already ? "Already rejected" : "Payment rejected",
      payment: result?.payment,
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Reject failed" });
  } finally {
    session.endSession();
  }
};

